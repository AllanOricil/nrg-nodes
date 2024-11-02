import Node from "./node";
import camelCase from "camelcase";

/**
 * Creates a mixin to extend Node-RED's node registration functionality.
 * This mixin ensures that the RED object is available in the class scope,
 * automatically registers the node and its event handlers.
 *
 * @param {object} RED - The Node-RED runtime object. It provides methods to register and manage nodes.
 * @returns {function} - A higher-order function that takes a base class and returns a new class with additional Node-RED functionalities.
 */
export function createNodeRedNodeMixin(RED) {
  return async function (BaseClass, type) {
    if (!(BaseClass.prototype instanceof Node)) {
      throw new Error(`${BaseClass.name} must extend Node`);
    }

    if (!type) {
      throw new Error(`${type} must be provided`);
    }

    const EVENT_HANDLER_PREFIX_RESERVED_WORD = "on";

    const EVENT_HANDLER_RESERVED_METHOD_NAMES = Object.getOwnPropertyNames(
      Node.prototype,
    ).filter((methodName) =>
      methodName.startsWith(EVENT_HANDLER_PREFIX_RESERVED_WORD),
    );

    if (Node.RED === undefined) {
      Object.defineProperty(Node, "RED", {
        value: RED,
        writable: false,
        configurable: false,
      });
    }

    if (BaseClass.RED === undefined) {
      Object.defineProperty(BaseClass, "RED", {
        value: RED,
        writable: false,
        configurable: false,
      });
    }

    if (BaseClass.type === undefined) {
      Object.defineProperty(BaseClass, "type", {
        value: type,
        writable: false,
        configurable: false,
      });
    }

    if (typeof BaseClass.init === "function") {
      const result = BaseClass.init();

      if (result instanceof Promise) {
        await result;
      }
    }

    return class extends BaseClass {
      /**
       * Creates an instance of a given node class and injects the RED object in it
       * @param {object} config - Configuration object for the node-red node instance.
       */
      constructor(config) {
        super(config);
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

      static registrationProperties() {
        // NOTE: this transformation happens because Node-RED requires that each property is prepended with the node's type in camelCase.
        // source: https://nodered.org/docs/creating-nodes/node-js#custom-node-settings
        return {
          credentials: BaseClass.credentials(),
          settings: (() => {
            const settings = BaseClass.settings();
            if (!settings) return undefined;

            for (const key in settings) {
              const newKey = camelCase(`${BaseClass.type}-${key}`);
              settings[newKey] = settings[key];
              delete settings[key];
            }

            return settings;
          })(),
        };
      }
    };
  };
}
