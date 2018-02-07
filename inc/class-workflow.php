<?php
/**
 * @package HM\Workflow
 */

namespace HM\Workflow;

/**
 * Class Workflow
 *
 * @package HM\Workflow
 */
/**
 * Class Workflow
 * @package HM\Workflow
 */
class Workflow {

	/**
	 * @var
	 */
	protected static $instances;

	/**
	 * @var
	 */
	protected $event;

	/**
	 * @var
	 */
	protected $recipients;

	/**
	 * @var
	 */
	protected $messages;

	/**
	 * @var
	 */
	protected $destinations;

	/**
	 * @param $id
	 *
	 * @return mixed
	 */
	public static function register( $id ) {
		$wf                = new self( $id );
		self::$instances[] = $wf;
		return $wf;
	}

	/**
	 * Workflow constructor.
	 *
	 * @param $id
	 */
	protected function __construct( $id ) {
		$this->id = $id;
	}

	/**
	 * @param Event|string $event Event ID or object.
	 *
	 * @return mixed
	 */
	public function when( $event ) {
		if ( is_string( $event ) ) {
			$this->event = Event::get( $event );
			if ( null === $this->event ) {
				$this->event = Event::register( $event );
			}
		}


		return $this;
	}

	/**
	 * @param $message
	 * @param $actions
	 *
	 * @return mixed
	 */
	public function what( $message, array $actions = [] ) {
		if ( is_callable( $message ) ) {
			// @todo
		}

		$this->messages[] = $message;
		return $this;
	}

	/**
	 * @param $who
	 *
	 * @return mixed
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
	 * @param $destination
	 */
	public function where( $destination ) {
		if ( is_array( $destination ) || is_string( $destination ) ) {
			$this->destinations[] = $destination;
		} elseif ( is_callable( $destination ) ) {
			// @todo
		}
		return $this;
	}

	/**
	 * @param $args
	 */
	protected function run( $args ) {

	}

	/**
	 * @param $event_id
	 * @param $action_id
	 * @param $nonce
	 */
	protected function run_actions( $event_id, $action_id, $nonce ) {

	}
}
