<?php
/**
 * Workflow class
 *
 * This class is what we will pass configurations created in the UI to. It can also be invoked directly programmatically.
 *
 * @link https://github.com/humanmade/Workflow/issues/3
 *
 * @package HM\Workflow
 * @since 0.1.0
 */

namespace HM\Workflow;

/**
 * Class Workflow
 */
class Workflow {

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
	 * The messages.
	 *
	 * @var array
	 */
	protected $messages = [];

	/**
	 * Workflow destinations.
	 *
	 * @var array
	 */
	protected $destinations = [];

	/**
	 * Registers a new Workflow object.
	 *
	 * @param string $id Workflow ID.
	 *
	 * @return Workflow
	 */
	public static function register( $id ) :Workflow {
		$wf                = new self( $id );
		self::$instances[] = $wf;
		return $wf;
	}

	/**
	 * Workflow constructor.
	 *
	 * @param string $id The workflow ID.
	 */
	protected function __construct( $id ) {
		$this->id = $id;
	}

	/**
	 * Attach the event to the workflow.
	 *
	 * @param Event|string $event Event ID or object.
	 *
	 * @return $this
	 */
	public function when( $event ) {
		if ( is_string( $event ) ) {
			$this->event = Event::get( $event );
			if ( null === $this->event ) {
				$this->event = Event::register( $event );
			}
		}

		$listeners = $this->event->get_listeners();

		foreach ( $listeners as $listener ) {
			if ( is_string( $listener ) ) {
				add_action( $listener, function() {
					$args = func_get_args();
					if ( ! empty( $args ) ) {
						$this->run( $args );
					}
				});
			} elseif ( is_array( $listener ) ) {
				// @todo: handle case
			} elseif ( is_callable( $listener ) ) {
				// @todo: handle case.
			}
		}

		return $this;
	}

	/**
	 * Message builder.
	 *
	 * @param string|callable $message Message.
	 * @param callable|array  $actions Actions.
	 *
	 * @return $this
	 */
	public function what( $message, array $actions = [] ) {
		if ( is_callable( $message ) ) {
			// @todo
		}

		$this->messages[] = $message;
		return $this;
	}

	/**
	 * Sets the recipients property.
	 *
	 * @param array|int|string|callable $who Workflow destination.
	 *
	 * @return $this
	 */
	public function who( $who ) {
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
	 * @param string!Destination $destination The Destination object.
	 *
	 * @return $this
	 */
	public function where( $destination ) {
		if ( is_string( $destination ) || is_a( $destination, HM\Workflow\Destination::class ) ) {
			$this->destinations[] = $destination;
		} elseif ( is_callable( $destination ) ) {
			$destination->call_handler( $this->recipients, $this->messages );
		}
		return $this;
	}

	/**
	 * Run the workflow.
	 *
	 * @param array $args The return value from the callback or arguments from the action.
	 */
	protected function run( array $args ) :void {
		$recipients = [];
		foreach ( $this->recipients as $recipient ) {
			// @todo: case If it matches one of $this->event->get_recipient_handler( $id ), get the return value from the callback, passing $args to the callback.
			if ( is_email( $recipient ) ) {
				$user = get_user_by( 'email', $recipient );
				if ( is_a( $user, 'WP_User' ) ) {
					$recipients[] = $user;
				}
			} elseif ( is_string( $recipient ) ) {
				$user = get_user_by( 'login', $recipient );
				if ( is_a( $user, 'WP_User' ) ) {
					$recipients[] = $user;
				} else {
					$users = get_users( [ 'role' => $recipient ] );
					if ( ! empty( $users ) ) {
						$recipients = array_merge( $recipients, $users );
					}
				}
			} else {
				// @todo: ??
			}
		}

		$messages = $this->messages; // Will need to parse.
//		foreach ( $this->messages as $message ) {
//			if ( is_callable( $message ) ) {
//				$result = $message( $args );
//			}
//			$message_tags = $this->event->get_message_tags();
//			// @todo: build message.
//		}

		foreach ( $this->destinations as $destination ) {
			// @todo Filter out recipients with this destination notification disabled
			$destination->call_handler( $recipients, $messages );
		}
	}

	/**
	 * Parse actions.
	 *
	 * @param array $actions The actions to run.
	 */
	protected function run_actions( array $actions ) :void {
		foreach ( $actions as $action ) {

		}
	}
}
