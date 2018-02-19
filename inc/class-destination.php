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
	 * Destination ID.
	 *
	 * @var string
	 */
	protected $id;

	/**
	 * Array of Destinations.
	 *
	 * @var array
	 */
	protected static $instances = [];

	/**
	 * Destination UI.
	 *
	 * @var UI
	 */
	protected $ui;

	/**
	 * Destination handler function.
	 *
	 * @var callable
	 */
	protected $handler;

	/**
	 * Registers a new Destination.
	 *
	 * @param string   $id      Destination ID.
	 * @param callable $handler Destination handler function.
	 */
	public static function register( string $id, callable $handler ) : Destination {
		$destination            = new self( $id, $handler );
		self::$instances[ $id ] = $destination;
		return $destination;
	}

	/**
	 * Destination constructor.
	 *
	 * @param string   $id      Destination ID.
	 * @param callable $handler Destination handler function.
	 */
	protected function __construct( string $id, callable $handler ) {
		$this->handler = $handler;
		$this->id      = $id;
	}

	/**
	 * Run the destination handler.
	 *
	 * @param array $recipients The recipients.
	 * @param array $messages   The messages to display.
	 */
	public function call_handler( array $recipients, array $messages ) {
		( $this->handler )( $recipients, $messages );
	}

	/**
	 * Add the UI object.
	 *
	 * @param UI $ui Destination UI.
	 *
	 * @return $this
	 */
	public function add_ui( UI $ui ) : self {
		$this->ui = $ui;
		return $this;
	}
}
