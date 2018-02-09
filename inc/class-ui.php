<?php
/**
 * UI class
 *
 * The UI class is for defining a set of fields and storing and retrieving the values of which are passed to the destination objects,
 * recipient and event handlers.
 *
 * @link https://github.com/humanmade/Workflow/issues/4
 *
 * @package HM\Workflow
 * @since 0.1.0
 */

namespace HM\Workflow;

/**
 * Class UI
 */
class UI {
	/**
	 * The identifier used in the name attribute, will be passed through sanitize_key().
	 *
	 * @var int $name A user facing text label for the UI component.
	 */
	protected $name;

	/**
	 * Fields definitions.
	 *
	 * @var array $fields The UI fields array.
	 */
	protected $fields = [];

	/**
	 * A description of the UI, this should be text to help the user understand the interface.
	 *
	 * @var string $description A description of the UI.
	 */
	protected $description;

	/**
	 * An identifier for the UI to store & fetch data against.
	 *
	 * @var string $key The key of the UI.
	 */
	protected $key;

	/**
	 * Stores the collection of UI objects.
	 *
	 * @var array $instances The collection of UI objects.
	 */
	protected static $instances = [];

	/**
	 * Registers and adds a UI object to the collection.
	 *
	 * @param string $name A user facing text label for the UI component.
	 *
	 * @return UI
	 */
	public static function register( $name ) : UI {
		$ui                       = new self( $name );
		self::$instances[ $name ] = $ui;
		return $ui;
	}

	/**
	 * UI constructor.
	 *
	 * @param string $name A user facing text label for the UI component.
	 */
	protected function __construct( $name ) {
		$this->name = $name;
	}

	/**
	 * This method should set the value of $this->key
	 *
	 * @param string $key An identifier for the UI to store & fetch data against.
	 *
	 * @return $this
	 */
	public function set_key( $key ) {
		$this->key = $key;

		return $this;
	}

	/**
	 * This method should set the value of $this->description
	 *
	 * @param string $description A description of the UI, this should be text to help the user understand the interface.
	 *
	 * @return $this
	 */
	public function set_description( $description ) {
		$this->description = $description;

		return $this;
	}

	/**
	 * This method will create an array from the passed parameters.
	 *
	 * @param string $name   The identifier used in the name attribute, will be passed through sanitize_key().
	 * @param string $label  The user facing text label.
	 * @param string $type   The field type.
	 * @param array  $params An optional array of custom parameters to configure fields other than text type.
	 *
	 * @return $this
	 */
	public function add_field( $name, $label, $type = 'text', array $params = array() ) {
		$this->fields[] = [
			'name'   => $name,
			'label'  => $label,
			'type'   => $type,
			'params' => $params,
			'value'  => $this->get_data(),
		];

		return $this;
	}

	/**
	 * This method should save the data using the key value, this might be implemented in options or post meta.
	 *
	 * @param array $data An array of the field values with the field names as the keys.
	 */
	public function save_data( $data ) {
		// @todo: handle this
	}

	/**
	 * Returns the keyed array of data associated with this UI.
	 *
	 * @return array
	 */
	public function get_data() : array {
		// @todo: handle this
	}

	/**
	 * A configuration object ready for JSON encoding or parsing in PHP to build the form fields.
	 *
	 * @return array
	 */
	public function get_config() : array {
		// @todo: handle this
	}
}
