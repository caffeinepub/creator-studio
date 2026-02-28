import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Array "mo:core/Array";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Video = {
    id : Text;
    title : Text;
    description : Text;
    duration : Nat;
    uploadTimestamp : Time.Time;
    file : Storage.ExternalBlob;
  };

  public type UserProfile = {
    name : Text;
  };

  let videos = Map.empty<Text, Video>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public type UploadResult = {
    #ok : Text;
    #error : Text;
  };

  public shared ({ caller }) func uploadVideo(
    id : Text,
    title : Text,
    description : Text,
    duration : Nat,
    file : Storage.ExternalBlob,
  ) : async UploadResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #error("Unauthorized: Only users can upload videos");
    };

    if (duration < 10 or duration > 20) {
      return #error("Video duration must be between 10 and 20 seconds. Provided: " # duration.toText() # " seconds");
    };

    let video : Video = {
      id;
      title;
      description;
      duration;
      uploadTimestamp = Time.now();
      file;
    };

    videos.add(id, video);
    #ok("Video uploaded successfully. Duration: " # duration.toText() # " seconds");
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query func getVideo(id : Text) : async ?Video {
    videos.get(id);
  };

  public query func listVideos() : async [Video] {
    videos.values().toArray();
  };

  // New Follower Functionality
  public type Follower = {
    follower : Principal;
    following : Principal;
  };

  let followers = Map.empty<Principal, [Principal]>();

  // Follow a user (add follower relationship)
  public shared ({ caller }) func followUser(target : Principal) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can follow others");
    };

    if (target == caller) {
      Runtime.trap("Cannot follow yourself");
    };

    switch (followers.get(target)) {
      case (?existingFollowers) {
        let isFollowing = existingFollowers.find(func(p) { p == caller });
        switch (isFollowing) {
          case (?_) { Runtime.trap("Already following this user") };
          case (null) {
            let updatedFollowers = existingFollowers.concat([caller]);
            followers.add(target, updatedFollowers : [Principal]);
          };
        };
      };
      case (null) {
        followers.add(target, [caller]);
      };
    };
    true;
  };

  // Unfollow a user (remove follower relationship)
  public shared ({ caller }) func unfollowUser(target : Principal) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unfollow others");
    };

    switch (followers.get(target)) {
      case (?existingFollowers) {
        let updatedFollowers = existingFollowers.filter(
          func(p) { p != caller }
        );
        followers.add(target, updatedFollowers : [Principal]);
        true;
      };
      case (null) {
        false;
      };
    };
  };

  // Get follower count for a user
  public query func getFollowerCount(user : Principal) : async Nat {
    switch (followers.get(user)) {
      case (?userFollowers) { userFollowers.size() };
      case (null) { 0 };
    };
  };

  // Check if the caller is following a specific user
  public query ({ caller }) func isFollowing(target : Principal) : async Bool {
    switch (followers.get(target)) {
      case (?userFollowers) {
        let isFollowing = userFollowers.find(func(p) { p == caller });
        isFollowing != null;
      };
      case (null) { false };
    };
  };
};
