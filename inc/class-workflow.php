<?php
/**
 * Workflow class
 *
 * This class is what we will pass configurations created in the UI to. It can also be invoked directly
 * programmatically.
 *
 * @link    https://github.com/humanmade/Workflow/issues/3
 *
 * @package HM\Workflow
 * @since   0.1.0
 */

namespace HM\Workflows;

/**
 * Class Workflow
 */
class Workflow {
	/**
	 * Workflow ID.
	 *
	 * @var string
	 */
	protected $id;

	/**
	 * Workflow instances.
	 *
	 * @var array
	 */
	protected static $instances = [];

	/**
	 * The Workflow Event.
	 *
	 * @var Event
	 */
	protected $event;

	/**
	 * The workflow recipients.
	 *
	 * @var array
	 */
	protected $recipients = [];

	/**
	 * The message array, contains keys 'subject', 'text' and 'actions'.
	 *
	 * @var array
	 */
	protected $message = [
		'subject' => '',
		'text'    => '',
		'actions' => [],
	];

	/**
	 * Workflow destinations.
	 *
	 * @var array
	 */
	protected $destinations = [];

	/**
	 * Registers a new Workflow object.
	 *
	 * @param string $id Identifier for the Workflow.
	 *
	 * @return Workflow
	 */
	public static function register( string $id = '' ): Workflow {
		$wf                     = new self( $id );
		self::$instances[ $id ] = $wf;

		return $wf;
	}

	/**
	 * Retrieve an existing Workflow object.
	 *
	 * @param string $id
	 * @return Workflow|null
	 */
	public static function get( string $id ) {
		return self::$instances[ $id ] ?? null;
	}

	/**
	 * Remove an existing Workflow object.
	 *
	 * @param string $id
	 */
	public static function remove( string $id ) {
		unset( self::$instances[ $id ] );
	}

	/**
	 * Workflow constructor.
	 *
	 * @param string $id Identifier for the workflow.
	 */
	protected function __construct( string $id = '' ) {
		$this->id = $id;

		add_action( "hm.workflows.run.{$this->id}", [ $this, 'run' ] );
	}

	/**
	 * Attach the event to the workflow.
	 *
	 * @param Event|array|string $event Event ID or object.
	 *
	 * @return $this
	 */
	public function when( $event ): Workflow {
		// Get existing or create the Event object.
		if ( is_string( $event ) ) {
			$this->event = Event::get( $event );
			if ( ! $this->event ) {
				$this->event = Event::register( $event )->set_listener( $event );
			}
		} elseif ( is_array( $event ) && isset( $event['action'] ) ) {
			$this->event = Event::get( $event['action'] );
			if ( ! $this->event ) {
				$this->event = Event::register( $event['action'] )->set_listener( $event );
			}
		} elseif ( is_callable( $event ) ) {
			$this->event = Event::register( $this->id )->set_listener( $event );
		} elseif ( is_a( $event, __NAMESPACE__ . '\Event' ) ) {
			$this->event = $event;
		}

		// Check we have a valid Event.
		if ( ! $this->event ) {
			trigger_error( 'Could not get event object for workflow ' . $this->id, E_USER_WARNING );

			return $this;
		}

		$listener = $this->event->get_listener();
		$ui_data  = [];

		if ( $this->event->get_ui() ) {
			$ui_data = $this->event->get_ui()->get_data();
		}

		// Call the listener.
		if ( is_string( $listener ) ) {
			add_action( $listener, function () use ( $ui_data ) {
				$this->schedule( array_merge( func_get_args(), [ $ui_data ] ) );
			} );
		} elseif ( is_array( $listener ) ) {
			add_action( $listener['action'], function () use ( $listener, $ui_data ) {
				$args = func_get_args();
				if ( isset( $listener['callback'] ) && is_callable( $listener['callback'] ) ) {
					$result = call_user_func_array(
						$listener['callback'],
						array_merge( $args, [ $ui_data ] )
					);
					if ( ! is_null( $result ) ) {
						if ( ! is_array( $result ) ) {
							$result = [ $result ];
						}
						$this->schedule( $result );
					}
				} else {
					$this->schedule( array_merge( $args, [ $ui_data ] ) );
				}
			}, $listener['priority'], $listener['accepted_args'] );
		} elseif ( is_callable( $listener ) ) {
			$result = call_user_func( $listener, $ui_data );
			if ( ! is_null( $result ) ) {
				if ( ! is_array( $result ) ) {
					$result = [ $result ];
				}
				$this->schedule( $result );
			}
		}

		return $this;
	}

	/**
	 * Message builder.
	 *
	 * @param string|callable $subject Subject line or short text for the notification.
	 * @param string|callable $text    Optional message body.
	 * @param array           $actions Actions to append to the message text.
	 *
	 * @return $this
	 */
	public function what( $subject, $text = '', array $actions = [] ): Workflow {
		$this->message = [
			'subject' => $subject,
			'text'    => $text,
			'actions' => array_map( function ( $action ) {
				return wp_parse_args( $action, [
					'text'            => null,
					'callback_or_url' => null,
					'args'            => [],
					'schema'          => [],
					'data'            => [],
				] );
			}, $actions ),
		];

		return $this;
	}

	/**
	 * Sets the recipients property.
	 *
	 * @param array|int|string|callable $who Workflow destination.
	 *
	 * @return $this
	 */
	public function who( $who ): Workflow {
		if ( is_array( $who ) ) {
			$this->recipients = array_merge( $this->recipients, $who );
		} else {
			$this->recipients[] = $who;
		}

		return $this;
	}

	/**
	 * Where to send the notification(s).
	 *
	 * @param string|Destination $destination The Destination object.
	 *
	 * @return $this
	 */
	public function where( $destination ): Workflow {
		if ( is_string( $destination ) ) {
			$destination = Destination::get( $destination );
		}

		if ( is_a( $destination, Destination::class ) ) {
			$this->destinations[] = $destination;
		} elseif ( is_callable( $destination ) ) {
			$this->destinations[] = Destination::register(
				'custom-' . $this->id . '-' . count( $this->destinations ),
				$destination
			);
		}

		return $this;
	}

	/**
	 * Schedule the workflow.
	 *
	 * @param array $args
	 */
	protected function schedule( array $args = [] ) {
		if ( wp_next_scheduled( "hm.workflows.run.{$this->id}", [ $args ] ) ) {
			return;
		}

		wp_schedule_single_event( time(), "hm.workflows.run.{$this->id}", [ $args ] );
	}

	/**
	 * Run the workflow.
	 *
	 * @param array $args The return value from the callback or arguments from the action.
	 */
	public function run( array $args = [] ) {
		// Process recipients.
		$recipients = [];
		foreach ( $this->recipients as $recipient ) {
			if ( is_numeric( $recipient ) ) {
				$user = get_user_by( 'id', intval( $recipient ) );
				if ( is_a( $user, 'WP_User' ) ) {
					$recipients[] = $user;
				}
			} elseif ( is_string( $recipient ) && is_email( $recipient ) ) {
				// Get user by email or add plain email.
				$user = get_user_by( 'email', $recipient );
				if ( is_a( $user, 'WP_User' ) ) {
					$recipients[] = $user;
				}
			} elseif ( is_string( $recipient ) ) {
				// Try to get user by login, users by role or a registered callback.
				if ( get_role( $recipient ) ) {
					$users = get_users( [ 'role' => $recipient ] );
					if ( ! empty( $users ) ) {
						$recipients = array_merge( $recipients, $users );
					}
				} elseif ( $recipient === 'all' ) {
					$recipients = array_merge( $recipients, get_users( [
						'paged' => -1,
					] ) );
				} elseif ( $this->event->get_recipient_handler( $recipient ) ) {
					$results = call_user_func_array( $this->event->get_recipient_handler( $recipient ), array_values( $args ) );

					if ( ! is_array( $results ) ) {
						$results = [ $results ];
					}

					$results = array_filter( (array) $results, function ( $result ) {
						return is_a( $result, 'WP_User' );
					} );

					$recipients = array_merge( $recipients, $results );
				} else {
					$user = get_user_by( 'login', $recipient );
					if ( is_a( $user, 'WP_User' ) ) {
						$recipients[] = $user;
					}
				}
			} elseif ( is_callable( $recipient ) ) {
				// If a callback was passed directly add the results.
				$results = call_user_func_array( $recipient, array_values( $args ) );
				$results = array_filter( (array) $results, function ( $result ) {
					return is_a( $result, 'WP_User' );
				} );

				$recipients = array_merge( $recipients, $results );
			}
		}

		// Process message.
		$tags = [];
		foreach ( $this->event->get_message_tags() as $key => $val ) {
			if ( is_callable( $val ) ) {
				$tags[ '%' . $key . '%' ] = call_user_func_array( $val, array_values( $args ) );
			} else {
				$tags[ '%' . $key . '%' ] = $val;
			}
		}

		$message = wp_parse_args( $this->message, [
			'subject' => '',
			'text'    => '',
			'actions' => [],
		] );

		// Guard.
		if ( empty( $message['subject'] ) ) {
			return;
		}

		if ( is_callable( $message['subject'] ) ) {
			$subject = call_user_func_array( $message['subject'], array_values( $args ) );
		} else {
			$subject = $message['subject'];
		}

		if ( is_callable( $message['text'] ) ) {
			$text = call_user_func_array( $message['text'], array_values( $args ) );
		} else {
			$text = $message['text'];
		}

		$parsed_message            = [];
		$parsed_message['subject'] = str_replace( array_keys( $tags ), array_values( $tags ), $subject );
		$parsed_message['text']    = str_replace( array_keys( $tags ), array_values( $tags ), $text );
		$parsed_message['actions'] = [];

		// Add actions from the message if any.
		foreach ( $message['actions'] as $id => $action ) {
			$this->event->add_message_action(
				$id,
				$action['text'],
				$action['callback_or_url'],
				$action['args'],
				$action['schema'],
				$action['data']
			);
		}

		// Parse actions.
		foreach ( $this->event->get_message_actions() as $id => $action ) {

			// Get the webhook payload.
			$payload = [];
			if ( is_callable( $action['args'] ) ) {
				$payload = call_user_func_array( $action['args'], array_values( $args ) );
			} elseif ( is_array( $action['args'] ) ) {
				$payload = $action['args'];
			}

			// Add workflow ID to payload.
			$payload['workflow'] = $this->id;

			/**
			 * Filter the webhook payload for a message action.
			 *
			 * @param array  $payload The data sent with the action.
			 * @param string $id      The action ID.
			 * @param array  $action  The action data.
			 */
			$payload = apply_filters( 'hm.workflows.webhook.payload', $payload, $id, $action );

			// Take the string value, or set to the webhook URL if it's a callback.
			$url = $action['callback_or_url'];
			if ( is_callable( $action['callback_or_url'] ) ) {
				$url = get_webhook_controller()->get_webhook_url( $this->event->get_id(), $id, $payload );
			}

			// Must be a URL for the action to valid.
			if ( ! filter_var( $url, FILTER_VALIDATE_URL ) ) {
				continue;
			}

			$parsed_message['actions'][ $id ] = [
				'text' => $action['text'],
				'url'  => $url,
				'data' => $action['data'],
			];
		}

		// Send those notifications!
		foreach ( $this->destinations as $destination ) {
			$destination->call_handler( $recipients, $parsed_message );
		}
	}
}
