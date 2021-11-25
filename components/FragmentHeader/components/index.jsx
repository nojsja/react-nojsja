import Date from './Date';
import Input from './Input';
import Switch from './Switch';
import TypedInput from './TypedInput';
import Button from './Button';
import DateRangePicker from './DateRangePicker';
import Number from './Number';
import ButtonGroup from './ButtonGroup';
import Select from './Select';

const map = {
  input: Input,
  number: Number,
  switch: Switch,
  typedInput: TypedInput,
  date: Date,
  button: Button,
  dateRangePicker: DateRangePicker,
  buttonGroup: ButtonGroup,
  select: Select,
};

export default {
  ...map,
  keys: Object.keys(map),
};
