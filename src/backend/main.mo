import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Blob "mo:core/Blob";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Video = {
    id : Text;
    title : Text;
    description : Text;
    uploadTimestamp : Time.Time;
    file : Storage.ExternalBlob;
  };

  public type UserProfile = {
    name : Text;
  };

  let videos = Map.empty<Text, Video>();
  let userProfiles = Map.empty<Principal, UserProfile>();

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

  public shared ({ caller }) func uploadVideo(
    id : Text,
    title : Text,
    description : Text,
    file : Storage.ExternalBlob,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only owners can upload videos");
    };

    let video : Video = {
      id;
      title;
      description;
      uploadTimestamp = Time.now();
      file;
    };

    videos.add(id, video);
  };

  public query func getVideo(id : Text) : async ?Video {
    videos.get(id);
  };

  public query func listVideos() : async [Video] {
    videos.values().toArray();
  };
};
