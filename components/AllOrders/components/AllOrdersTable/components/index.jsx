import Pay from './Pay';
import Out from './Out';
import Upload from './Upload';
import Ordered from './Ordered';
import Correct from './Correct';
import Revoke from './Revoke';
import Abnormal from './Abnormal';

const map = {
  pay: Pay,
  out: Out,
  upload: Upload,
  ordered: Ordered,
  correct: Correct,
  revoke: Revoke,
  abnormal: Abnormal,
};
export default {
  ...map,
};
