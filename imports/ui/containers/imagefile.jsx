import composeWithTracker from "/imports/helpers/composetracker";
import Images from "/imports/api/images/collection";

import ImageFile from "/imports/ui/components/imagefile";

export default composeWithTracker((props, onData) => {
  if (props.imageId) {
    let result = Images.findOne({ _id: props.imageId });

    if (result) {
      onData(null, {
        src: result.link(),
        ready: true
      });

      return;
    }
  }

  onData(null, {
    ready: false
  });
})(ImageFile);
