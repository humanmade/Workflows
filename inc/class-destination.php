<?php
/**
 * Destination class.
 *
 * This class handles the list of recipients and messages and optionally allows you to specify a UI for the destination.
 *
 * @link https://github.com/humanmade/Workflow/issues/2
 *
 * @package WordPress
 * @subpackage Component
 * @since 0.1.0
 */

namespace HM\Workflow;

/**
 * Class Destination
 */
class Destination {
	/**
	 * @var
	 */
	protected $id;

	/**
	 * @var
	 */
	protected static $instances = [];

	/**
	 * @var UI
	 */
	protected $ui;

	/**
	 * @var callable
	 */
	protected $handler;

	/**
	 *
	 *
	 * @param string $id
	 * @param callable $handler
	 */
	public static function register( $id, $handler ) {
		$destination            = new self( $id, $handler );
		self::$instances[ $id ] = $destination;
		return $destination;
	}

	/**
	 * Destination constructor.
	 *
	 * @param string $id
	 * @param callable $handler
	 */
	protected function __construct( $id, $handler ) {
		$this->handler = $handler;
		$this->id      = $id;
	}

	/**
	 * @param array $recipients
	 * @param array $messages
	 */
	public function call_handler( $recipients, $messages ) {
		$message = $messages[0];
		( $this->handler )( $recipients, 'A message for you sir.', $messages );
	}

	/**
	 * Add the UI object.
	 *
	 * @param UI $ui
	 *
	 * @return $this
	 */
	public function add_ui( $ui ) {
		$this->ui = $ui;
		return $this;
	}
}
