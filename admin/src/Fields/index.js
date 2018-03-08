/*global HM*/
import Field from './Field';
import Checkbox from './Checkbox';
import Select from './Select';
import Textarea from './Textarea';

// Allow other field handlers to be registered.
HM.Workflows.Fields = Object.assign( {
	base:     Field,
	text:     Field,
	number:   Field,
	url:      Field,
	checkbox: Checkbox,
	select:   Select,
	textarea: Textarea,
}, HM.Workflows.Fields );

export const Fields = HM.Workflows.Fields;
