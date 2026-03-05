import Map "mo:core/Map";
import Text "mo:core/Text";
import Storage "blob-storage/Storage";

module {
  type OldVideo = {
    id : Text;
    title : Text;
    description : Text;
    duration : Nat;
    uploadTimestamp : Int;
    file : Storage.ExternalBlob;
    viewCount : Nat;
  };

  type OldActor = {
    videos : Map.Map<Text, OldVideo>;
  };

  type NewVideo = {
    id : Text;
    title : Text;
    description : Text;
    duration : Nat;
    uploadTimestamp : Int;
    file : Storage.ExternalBlob;
    viewCount : Nat;
    thumbnail : ?Storage.ExternalBlob;
  };

  type NewActor = {
    videos : Map.Map<Text, NewVideo>;
  };

  public func run(old : OldActor) : NewActor {
    let newVideos = old.videos.map<Text, OldVideo, NewVideo>(
      func(_id, oldVideo) { { oldVideo with thumbnail = null } }
    );
    { old with videos = newVideos };
  };
};
