import Node from "./node";

/**
 * Creates a mixin to extend Node-RED's node registration functionality.
 * This mixin ensures that the RED object is available in the class scope and
 * automatically registers event handlers defined in the base class.
 *
 * @param {object} RED - The Node-RED runtime object. It provides methods to register and manage nodes.
 * @returns {function} - A higher-order function that takes a base class and returns a new class with additional Node-RED functionalities.
 */
function createNodeRedNodeMixin(RED) {
  return function (BaseClass) {
    if (!(BaseClass.prototype instanceof Node)) {
      throw new Error(`${BaseClass.name} must extend Node`);
    }

    const EVENT_HANDLER_PREFIX_RESERVED_WORD = "on";

    const EVENT_HANDLER_RESERVED_METHOD_NAMES = Object.getOwnPropertyNames(
      Node.prototype,
    ).filter((methodName) =>
      methodName.startsWith(EVENT_HANDLER_PREFIX_RESERVED_WORD),
    );

    return class extends BaseClass {
      static RED = RED;

      /**
       * Creates an instance of a given node class and injects the RED object in it
       * @param {object} config - Configuration object for the node-red node instance.
       */
      constructor(config) {
        super(config);
        console.log("derived class");

        this.setupEventHandlers();
      }

      /**
       * Sets up event handlers for the node. Automatically binds methods starting with "on" from the base class
       * to their corresponding events.
       */
      setupEventHandlers() {
        Object.getOwnPropertyNames(BaseClass.prototype)
          .filter((methodName) =>
            EVENT_HANDLER_RESERVED_METHOD_NAMES.includes(methodName),
          )
          .forEach((methodName) => {
            this.on(
              methodName
                .split(EVENT_HANDLER_PREFIX_RESERVED_WORD)[1]
                .toLocaleLowerCase(),
              this[methodName],
            );
          });
      }
    };
  };
}

/**
 * Registers multiple Node-RED nodes with the provided RED runtime.
 *
 * @param {object} RED - The Node-RED runtime object. It provides methods to register and manage nodes.
 * @param {Array<object>} nodes - An array of node-red node classes.
 * @throws {Error} If a Node class does not have a `type` property.
 */
export function registerNodes(RED, nodes) {
  const nodeRedNodeMixin = createNodeRedNodeMixin(RED);
  for (const node of nodes) {
    if (!node.type) {
      throw new Error(
        `${node.name} must declare its type as a static prop called type`,
      );
    }
    RED.nodes.registerType(node.type, nodeRedNodeMixin(node));
  }
}
