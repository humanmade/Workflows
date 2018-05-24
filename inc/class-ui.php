<?php
/**
 * UI class
 *
 * The UI class is for defining a set of fields and storing and retrieving the values of which are passed to the
 * destination objects, recipient and event handlers.
 *
 * @link    https://github.com/humanmade/Workflow/issues/4
 *
 * @package HM\Workflow
 * @since   0.1.0
 */

namespace HM\Workflows;

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
	 * Field data.
	 *
	 * @var array $data The UI data array.
	 */
	protected $data = [];

	/**
	 * A description of the UI, this should be text to help the user understand the interface.
	 *
	 * @var string $description A description of the UI.
	 */
	protected $description;

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
	public static function register( string $name ): UI {
		$ui                = new self( $name );
		self::$instances[] = $ui;

		return $ui;
	}

	/**
	 * UI constructor.
	 *
	 * @param string $name A user facing text label for the UI component.
	 */
	protected function __construct( string $name ) {
		$this->name = $name;
	}

	/**
	 * This method should set the value of $this->description
	 *
	 * @param string $description A description of the UI, this should be text to help the user understand the
	 *                            interface.
	 *
	 * @return $this
	 */
	public function set_description( string $description ): UI {
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
	public function add_field( string $name, string $label, string $type = 'text', array $params = [] ): UI {
		$this->fields[] = [
			'name'   => $name,
			'label'  => $label,
			'type'   => $type,
			'params' => (object) $params,
		];

		return $this;
	}

	/**
	 * Sets the data for this UI instance.
	 *
	 * @param array $data An array of the field values with the field names as the keys.
	 * @return UI
	 */
	public function set_data( array $data ): UI {
		$this->data = $data;

		return $this;
	}

	/**
	 * Get the human readable name.
	 *
	 * @return string
	 */
	public function get_name() {
		return $this->name;
	}

	/**
	 * Get the human readable description.
	 *
	 * @return string
	 */
	public function get_description() {
		return $this->description;
	}

	/**
	 * Returns the keyed array of data associated with this UI.
	 *
	 * @return array
	 */
	public function get_data(): array {
		return $this->data;
	}

	/**
	 * Returns the keyed array of data associated with this UI.
	 *
	 * @return array
	 */
	public function get_field_data( $name ) {
		return $this->get_data()[ $name ] ?? null;
	}

	/**
	 * A configuration object ready for JSON encoding or parsing in PHP to build the form fields.
	 *
	 * @return array
	 */
	public function get_config(): array {
		return [
			'name'        => $this->name,
			'description' => $this->description,
			'fields'      => $this->fields,
			'data'        => (object) $this->data,
		];
	}
}
