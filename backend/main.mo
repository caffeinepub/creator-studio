import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Apply migration on upgrade

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
    viewCount : Nat;
    thumbnail : ?Storage.ExternalBlob; // New thumbnail field
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
    thumbnail : ?Storage.ExternalBlob, // Now accepts an optional thumbnail
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
      viewCount = 0;
      thumbnail; // Store thumbnail if provided
    };

    videos.add(id, video);
    #ok("Video uploaded successfully. Duration: " # duration.toText() # " seconds");
  };

  public shared ({ caller }) func uploadThumbnail(videoId : Text, thumbnail : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload thumbnails");
    };

    switch (videos.get(videoId)) {
      case (?video) {
        let updatedVideo = { video with thumbnail = ?thumbnail };
        videos.add(videoId, updatedVideo);
      };
      case (null) {
        Runtime.trap("Video not found");
      };
    };
  };

  public shared ({ caller }) func getVideo(id : Text) : async ?Video {
    switch (videos.get(id)) {
      case (?video) {
        let updatedVideo = { video with viewCount = video.viewCount + 1 };
        videos.add(id, updatedVideo);
        ?updatedVideo;
      };
      case (null) { null };
    };
  };

  public query func listVideos() : async [Video] {
    videos.values().toArray();
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

  // New Follower Functionality
  let followers = Map.empty<Principal, [Principal]>();

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

  public query func getFollowerCount(user : Principal) : async Nat {
    switch (followers.get(user)) {
      case (?userFollowers) { userFollowers.size() };
      case (null) { 0 };
    };
  };

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

