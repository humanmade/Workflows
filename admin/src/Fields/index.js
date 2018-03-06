/*global HM*/
import Field from './Field';
import Checkbox from './Checkbox';

// Allow other field handlers to be registered.
HM.Workflows.Fields = Object.assign( {
	base:     Field,
	text:     Field,
	checkbox: Checkbox,
}, HM.Workflows.Fields );

export const Fields = HM.Workflows.Fields;
