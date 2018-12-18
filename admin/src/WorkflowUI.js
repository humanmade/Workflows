/*global HM, jQuery*/
import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import Portal from './Portal';
import 'react-toggle/style.css';
import Toggle from 'react-toggle';
import Select, { Async as AsyncSelect } from 'react-select';
import Editor from './Editor';
import styled, { css } from 'styled-components';
import UIForm from './Form';
import Errors from './Errors';
import __ from './l10n';

const Loading = styled.div`
	.spinner {
		display: block;
		float: none;
		margin: 30px auto;
	}
`

const SubmitBox = styled.div`
	.hm-workflow-options__enable {
		margin-bottom: 20px;
		.react-toggle {
			vertical-align: middle;
			margin-right: 8px;
		}
	}
`

const StyledQuestionBox = styled.div`
	margin-top: 10px;
	padding: 0 0 10px 0;

	.hm-workflows-arrow {
		display: block;
		width: 40%;
		height: 1px;
		background: rgba(0,0,0,.25);
		position: relative;
		margin: 0 auto 50px;

		&:before {
			position: absolute;
			top: 0px;
			content: '';
			background: rgba(0,0,0,.25);
			width: 1px;
			height: 50px;
			margin-left: 50%;
		}

		&:after {
			position: absolute;
			top: 50px;
			left: -4px;
			content: '';
			background: rgba(0,0,0,.25);
			width: 9px;
			height: 9px;
			border-radius: 100px;
			margin-left: 50%;
		}
	}

	&.hm-question-appear,
	&.hm-question-enter {
		.hm-workflows-arrow {
			width: 0;
			&:before {
				height: 0;
			}
			&:after {
				opacity: 0.01;
				top: 0;
			}
		}

		.hm-question-body {
			position: relative;
			opacity: 0.01;
			top: 100px;
		}
	}

	&.hm-question-appear.hm-question-appear-active,
	&.hm-question-enter.hm-question-enter-active {
		.hm-workflows-arrow {
			width: 40%;
			transition: width .65s ease-out;
			&:before {
				height: 50px;
				transition: height .5s ease-out .25s;
			}
			&:after {
				opacity: 1;
				top: 50px;
				transition: top .5s ease-out .25s, opacity .5s ease-out;
			}
		}

		.hm-question-body {
			transition: opacity .65s ease-out .25s, top .3s ease-out .25s;
			opacity: 1;
			top: 0;
		}
	}

	&.hm-question-exit {
		.hm-question-body {
			position: relative;
			opacity: 1;
			top: 0;
		}

		.hm-workflows-arrow {
			width: 40%;
			opacity: 1;
		}
	}

	&.hm-question-exit.hm-question-exit-active {
		.hm-workflows-arrow {
			width: 0;
			opacity: 0;
			transition: width .3s ease-in, opacity .25s ease-in;
		}

		.hm-question-body {
			transition: opacity .3s ease-in, top .3s ease-in;
			opacity: 0;
			top: 200px;
		}
	}
`

const QuestionBox = props => <CSSTransition
	timeout={1000}
	classNames="hm-question"
	appear={true}
	mountOnEnter={true}
	unmountOnExit={true}
	in={props.in}
>
	<StyledQuestionBox>
		{props.step && props.step > 1 && <span className="hm-workflows-arrow"/>}
		<div className="hm-question-body">
			{props.children}
		</div>
	</StyledQuestionBox>
</CSSTransition>;

const Question = styled.h3`
	text-align: center;
	padding: 20px 0 15px;
	margin: 0;
`

const MessageActions = styled.div`
	p {
		font-style: italic;
	}
	ul {
		list-style: none;
	}
	li {
		display: inline-block;
		margin-right: 5px;
	}
`

const Form = styled.div`
	margin-bottom: 20px;

	${ props => props.hasFields && css`
		display: flex;
	` }
`

const StyledFieldset = styled.fieldset`
	flex: 1;

	& ~ fieldset {
		margin-left: 10px;
	}

	&.hm-workflows-fields-enter,
	&.hm-workflows-fields-appear {
		opacity: 0.01;
	}

	&.hm-workflows-fields-enter.hm-workflows-fields-enter-active,
	&.hm-workflows-fields-appear.hm-workflows-fields-appear-active {
		opacity: 1;
		transition: opacity .3s ease-out;
	}

	&.hm-workflows-fields-exit {
		opacity: 1;
	}

	&.hm-workflows-fields-exit.hm-workflows-fields-exit-active {
		opacity: 0;
		transition: opacity .3s ease-in;
	}
`

const Fieldset = props => <CSSTransition
	appear={true}
	timeout={1000}
	in={props.in}
	mountOnEnter={true}
	unmountOnExit={true}
	classNames="hm-workflows-fields"
>
	<StyledFieldset>
		{props.children}
	</StyledFieldset>
</CSSTransition>;

const Field = styled.div`
	margin: 0 auto 1em;
	padding: 8px 0;

	label {
		font-weight: bold;
		display: block;
	}
`

class WorkflowUI extends Component {
	constructor() {
		super();

		this.state = {
			loading:        false,
			enabled:        false,
			saving:         false,
			errors:         [],
			event:          null,
			subject:        '',
			defaultSubject: '',
			message:        '',
			defaultMessage: '',
			recipients:     [],
			destinations:   [],
			// React is good at not redoing work.
			availableRecipients:   [],
			availableDestinations: [],
		};
	}

	componentDidMount() {
		// Don't fetch on new post or no post ID found.
		if ( ! this.props.postId || window.location.pathname.match(/post-new\.php/) ) {
			return;
		}

		// Fetch post data and set initial state.
		this.setState( { loading: true } );

		fetch( `${ HM.Workflows.Namespace }/workflows/${ this.props.postId }`, {
			credentials: 'same-origin',
			headers:     {
				'X-WP-Nonce': HM.Workflows.Nonce,
			}
		} )
			.then( response => response.json() )
			.then( data => {
				let event = data.event && HM.Workflows.Events.find( event => event.id === data.event.id );

				// Set up event object.
				if ( event ) {
					event = Object.assign( {}, event, {
						ui: Object.assign( {}, event.ui, {
							data: Object.assign( {}, event.ui.data, data.event.data ),
						} ),
					} );
				}

				const recipients = HM.Workflows.Recipients.concat( ( event && event.recipients ) || [] );

				this.setState( {
					loading:        false,
					enabled:        data.status === 'publish',
					event:          event,
					subject:        data.subject,
					defaultSubject: data.subject,
					message:        data.message,
					defaultMessage: data.message,
					recipients:     data.recipients.filter( rec => rec.id ).map( recipient => {
						const recipientObject = recipients.find( rec => rec.id === recipient.id );
						const recipientValue  = recipient.value
							? { value: recipientObject.isMulti ? recipient.value : recipient.value[0] }
							: {};
						return Object.assign( {}, recipientObject, recipientValue );
					} ),
					destinations:   data.destinations.map( destination => {
						const destObject = HM.Workflows.Destinations.find( dest => dest.id === destination.id );
						return Object.assign( {}, destObject, {
							ui: Object.assign( {}, destObject.ui, {
								data: Object.assign( {}, destObject.ui.data, destination.data )
							} )
						} );
					} ),
					availableRecipients: HM.Workflows.Recipients
						.concat( ( event && event.recipients ) || [] )
						.filter( recipient => recipient.id && data.recipients.map( rec => rec.id ).indexOf( recipient.id ) < 0 ),
					availableDestinations: HM.Workflows.Destinations
						.filter( destination => data.destinations.map( dest => dest.id ).indexOf( destination.id ) < 0 ),
				} );
			} );

	}

	saveWorkflow() {

		// Do checks.
		if ( ! this.state.event ) {
			// Show error.
			this.addError( 'no-event', 'You must select an event to trigger the workflow' );
			return;
		}

		this.setState( { saving: true } );

		fetch( `${ HM.Workflows.Namespace }/workflows/${ this.props.postId }`, {
			credentials: 'same-origin',
			method: this.props.postId ? 'POST' : 'PATCH',
			headers: {
				'X-WP-Nonce': HM.Workflows.Nonce,
				'content-type': 'application/json',
			},
			body: JSON.stringify( {
				status: this.state.enabled ? 'publish' : 'draft',
				title: document.getElementById( 'title' ).value,
				event: {
					id: this.state.event.id,
					data: this.state.event.ui.data
				},
				subject: this.state.subject,
				message: this.state.message,
				recipients: this.state.recipients.filter( rec => rec.id ).map( recipient => {
					const recipientObject = { id: recipient.id };
					let recipientValue = {};

					if ( recipient.value ) {
						if ( recipient.isMulti ) {
							recipientValue = { value: recipient.value };
						} else {
							recipientValue = { value: [ recipient.value ] };
						}
					}

					return Object.assign( {}, recipientObject, recipientValue );
				} ),
				destinations: this.state.destinations.map( destination => ({
					id: destination.id,
					data: destination.ui.data,
				}) )
			} ),
		} )
			.then( response => response.json() )
			.then( data => {
				this.setState( {
					saving: false,
				} );

				// Redirect if creating a new Workflow.
				if ( window.location.pathname.match('post-new.php') && data.id ) {
					window.onbeforeunload = null;
					window.jQuery && jQuery(window).off('beforeunload');
					document.getElementById('post').submit();
				}
			} );

	}

	addError( code, message ) {
		this.setState( {
			errors: this.state.errors.concat( [
				{ code, message }
			] )
		} );
	}

	updateErrors( condition, code ) {
		if ( condition ) {
			return this.state.errors.filter( error => error.code !== code );
		}
		return this.state.errors;
	}

	render() {
		const {
			loading,
			errors,
			enabled,
			saving,
			event,
			subject,
			defaultSubject,
			defaultMessage,
			recipients,
			destinations,
			availableRecipients,
			availableDestinations,
		} = this.state;

		// If we have data show a loading indicator before we get to the UI.
		if ( loading ) {
			return <Loading>
				<Portal target="#hm-workflow-options">
					<SubmitBox>
						<Loading>
							<span className="spinner is-active" />
						</Loading>
					</SubmitBox>
				</Portal>
				<span className="spinner is-active" />
			</Loading>;
		}

		return <div className="hm-workflow-ui-wrap">

			<Portal target="#hm-workflow-options">
				<SubmitBox>
					<div className="hm-workflow-options__enable">
						<label htmlFor="hm-workflow-enabled">
							<Toggle
								id="hm-workflow-enabled"
								name="workflow-enabled"
								value="1"
								checked={ enabled }
								onChange={ () => this.setState( { enabled: ! enabled } ) }
								icons={false}
							/>
							{ __( 'Enable' ) }
						</label>
					</div>
					<div className="hm-workflow-options__actions">
						<button
							type="button"
							className="button button-primary"
							disabled={ saving }
							onClick={ () => this.saveWorkflow() }
						>
							{ saving ? __( 'Saving' ) : __( 'Save' ) }
						</button>
						<span className={`spinner ${ saving && 'is-active' }`}/>
					</div>
				</SubmitBox>
			</Portal>

			<Errors errors={ errors } />

			<QuestionBox step={1} in={true}>
				<Question>{ __( 'When should the workflow run?' ) }</Question>
				<Form hasFields={!!(event && event.ui.fields.length)}>
					<Fieldset in={true}>
						<Select
							options={HM.Workflows.Events}
							name="event"
							getOptionLabel={ option => option.ui.name }
							getOptionValue={ option => option.id }
							value={this.state.event || ''}
							onChange={option => this.setState( {
								event:  option || null,
								errors: this.updateErrors( option.object, 'no-event' ),
								recipients: recipients
									.slice()
									.filter( rec => HM.Workflows.Recipients.map( rec => rec.id ).indexOf( rec.id ) >= 0 ),
								availableRecipients: availableRecipients
									.slice()
									.filter( rec => HM.Workflows.Recipients.map( rec => rec.id ).indexOf( rec.id ) >= 0 )
									.concat( ( option && option.recipients ) || [] ),
							}, () => {
								this.refs.subject.focus();
							} )}
							resetValue=""
						/>
					</Fieldset>
					<Fieldset in={!!(event && event.ui.fields.length)}>
						{ event && <UIForm
							name="event"
							{...event.ui}
							onChange={( value, field ) => this.setState( {
								event: Object.assign( {}, event, {
									ui: Object.assign( {}, event.ui, {
										data: Object.assign( {}, event.ui.data, {
											[ field.name ]: value
										} )
									} )
								} )
							} )}
						/> }
					</Fieldset>
				</Form>
			</QuestionBox>

			<QuestionBox step={2} in={!!event}>
				<Question>{ __( 'What message should be sent?' ) }</Question>

				<Field>
					<label htmlFor="subject">{ __( 'Subject' ) }</label>
					<Editor
						id="subject"
						type="text"
						name="subject"
						ref="subject"
						placeholder={ __( 'Briefly state what has happened or the action to take...' ) }
						content={ defaultSubject }
						onChange={content => this.setState( { subject: content } )}
						tags={ event && event.tags }
					/>
				</Field>

				<Field>
					<label htmlFor="message">{ __( 'Message' ) }</label>
					<Editor
						id="message"
						name="message"
						placeholder={ __( 'Add an optional detailed message here...' ) }
						ref="message"
						content={ defaultMessage }
						onChange={ content => this.setState( { message: content } ) }
						tags={ event && event.tags }
					/>
				</Field>

				{ event && event.actions.length
					? <MessageActions>
						<p>{ __( 'The following actions will be added to the message.' ) }</p>
						<ul>
							{ event.actions.map( action => {
								return <li key={action.id}><span className="button button-secondary">{action.text}</span></li>;
							} )}
						</ul>
					</MessageActions>
					: null
				}
			</QuestionBox>

			<QuestionBox step={3} in={!!(event && subject)}>
				<Question>{ __( 'Who should be notified?' ) }</Question>
				{ recipients.map( recipient => {
					return  recipient.id && ( <Form key={recipient.id} hasFields={recipient.options || recipient.endpoint}>
						<Fieldset in={true}>
							<Select
								value={ recipient }
								options={[]}
								onInputChange={ value => {
									if ( ! value ) {
										this.setState( {
											recipients: recipients.filter( rec => rec.id !== recipient.id ),
											availableRecipients: availableRecipients.concat( [ recipient ] ),
										} )
									}
								} }
								getOptionLabel={ option => option.name }
								getOptionValue={ option => option.id }
								openMenuOnClick={false}
								openMenuOnFocus={false}
								isClearable
								searchable={false}
								components={{
									Menu: () => null,
									DropdownIndicator: () => null,
									IndicatorSeparator: () => null,
								}}
							/>
						</Fieldset>
						<Fieldset in={!!(recipient.options && recipient.options.length && ! recipient.endpoint)}>
							<Select
								options={ recipient.options }
								isMulti={ recipient.isMulti }
								value={ recipient.value && recipient.options && (
									recipient.isMulti
										? recipient.options.filter( item => recipient.value.indexOf( item.value ) > -1 )
										: recipient.options.find( item => recipient.value === item.value )
								) }
								getOptionLabel={ option => option.label }
								getOptionValue={ option => option.value }
								onChange={ option => this.setState( {
									recipients: recipients.map( rec => {
										if ( rec.id !== recipient.id ) {
											return rec;
										}
										return Object.assign( {}, rec, {
											value: recipient.isMulti ? option.map( item => item.value ) : [ option.value ],
										} );
									} ),
								} )}
							/>
						</Fieldset>
						<Fieldset in={!!(recipient.endpoint)}>
							{ recipient.endpoint && <AsyncSelect
								isMulti={ recipient.isMulti }
								defaultOptions
								cacheOptions
								loadOptions={ async input => {
									const fetchOpts = {
										credentials: 'same-origin',
										headers:     {
											'X-WP-Nonce': HM.Workflows.Nonce,
										},
									};

									let results = [];
									let exclude = '';

									// Get selected.
									if ( recipient.value ) {
										const valueResponse = await fetch( `${recipient.endpoint.url}?include=${ recipient.value }`, fetchOpts );
										const value = await valueResponse.json();
										results.concat( value );
										exclude = `&exclude=${ value.map( item => item.id ).join( ',' ) }`;

										this.setState( {
											recipients: recipients.map( rec => {
												if ( rec.id !== recipient.id ) {
													return rec;
												}
												return Object.assign( {}, rec, {
													options: recipient.isMulti ? value : value.shift(),
												} );
											} )
										} );
									}

									const search = input ? `&search=${encodeURIComponent( input )}` : '';
									const response = await fetch( `${recipient.endpoint.url}?per_page=100&_locale=user${ exclude }${ search }`, fetchOpts );
									const data = await response.json();

									return data;
								} }
								value={ recipient.options }
								getOptionLabel={ option => option[ recipient.endpoint.labelKey || 'name' ] }
								getOptionValue={ option => option[ recipient.endpoint.valueKey || 'id' ] }
								onChange={ option => this.setState( {
									recipients: recipients.map( rec => {
										if ( rec.id !== recipient.id ) {
											return rec;
										}
										const key = recipient.endpoint.valueKey || 'id';
										return Object.assign( {}, rec, {
											options: option,
											value: recipient.isMulti ? option.map( item => item[ key ] ) : [ option[ key ] ],
										} );
									} )
								} ) }
							/> }
						</Fieldset>
					</Form> )
				} )}
				<Fieldset in={!!availableRecipients.length}>
					<Select
						options={ availableRecipients }
						name="who[]"
						getOptionLabel={ option => option.name }
						getOptionValue={ option => option.id }
						value={''}
						placeholder={ recipients.length ? __( 'Select another...' ) : __( 'Select...' ) }
						onChange={ option => this.setState( {
							recipients: recipients.slice().concat( [ option ] ),
							availableRecipients: availableRecipients.slice().filter( recipient => recipient.id !== option.id ),
						} ) }
					/>
				</Fieldset>
			</QuestionBox>

			<QuestionBox step={4} in={!!(event && subject && recipients.length)}>
				<Question>{ __( 'Where should they be notified?' ) }</Question>
				{ destinations.map( destination => {
					return <Form key={destination.id} hasFields={destination.ui.fields.length}>
						<Fieldset in={true}>
							<Select
								value={ destination }
								options={[]}
								onInputChange={ value => {
									if ( ! value ) {
										this.setState( {
											destinations: destinations.filter( dest => dest.id !== destination.id ),
											availableDestinations: availableDestinations.concat( [ destination ] ),
										} );
									}
								} }
								getOptionLabel={ option => option.ui.name }
								getOptionValue={ option => option.id }
								openMenuOnClick={false}
								openMenuOnFocus={false}
								searchable={false}
								isClearable
								components={{
									Menu: () => null,
									DropdownIndicator: () => null,
									IndicatorSeparator: () => null,
								}}
							/>
						</Fieldset>
						<Fieldset in={!!(destination.ui && destination.ui.fields.length)}>
							<UIForm
								{ ...destination.ui }
								onChange={( value, field ) => this.setState( {
									destinations: destinations.map( dest => {
										if ( dest.id !== destination.id ) {
											return dest;
										}

										const data = Object.assign( {}, dest.ui.data, { [ field.name ]: value } );
										const ui = Object.assign( {}, dest.ui, { data } );

										return Object.assign( {}, dest, { ui } );
									} )
								} )}
							/>
						</Fieldset>
					</Form>
				} )}
				<Fieldset in={!!availableDestinations.length}>
					<Select
						options={ availableDestinations }
						name="where[]"
						getOptionLabel={ option => option.ui.name }
						getOptionValue={ option => option.id }
						value={''}
						placeholder={ this.state.destinations.length ? __( 'Select another...' ) : __( 'Select...' ) }
						onChange={ option => this.setState( {
							destinations: destinations.slice().concat( [ option ] ),
							availableDestinations: availableDestinations.slice().filter( destination => destination.id !== option.id ),
						} ) }
					/>
				</Fieldset>
			</QuestionBox>

		</div>;
	}
}

export default WorkflowUI;
