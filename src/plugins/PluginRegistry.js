// PluginRegistry.js

/**
 * @typedef {Object} Plugin
 * @property {string} name - The unique name of the plugin
 * @property {React.ComponentType} component - The React component to be rendered
 * @property {function(Object): boolean} shouldUse - Function to determine if the plugin should be used for a given schema
 */

class PluginRegistry {
  constructor() {
    this.plugins = [];
  }

  /**
   * Register a new plugin
   * @param {Plugin} plugin - The plugin to register
   */
  register(plugin) {
    if (this.plugins.some((p) => p.name === plugin.name)) {
      console.warn(
        `Plugin with name "${plugin.name}" is already registered. It will be overwritten.`
      );
      this.unregister(plugin.name);
    }
    this.plugins.push(plugin);
  }

  /**
   * Unregister a plugin by name
   * @param {string} name - The name of the plugin to unregister
   */
  unregister(name) {
    this.plugins = this.plugins.filter((plugin) => plugin.name !== name);
  }

  /**
   * Get a plugin that should be used for a given schema
   * @param {Object} schema - The JSON schema to check against
   * @returns {Plugin|undefined} The matching plugin, or undefined if none found
   */
  getPlugin(schema) {
    return this.plugins.find((plugin) => plugin.shouldUse(schema));
  }

  /**
   * Get all registered plugins
   * @returns {Plugin[]} Array of all registered plugins
   */
  getAllPlugins() {
    return [...this.plugins];
  }

  /**
   * Clear all plugins
   */
  clear() {
    this.plugins = [];
  }
}

// Create and export a singleton instance of PluginRegistry
export const pluginRegistry = new PluginRegistry();

// Example usage:

// import { pluginRegistry } from './PluginRegistry';

// // Define a custom plugin
// const MyCustomPlugin = {
//   name: 'myCustomPlugin',
//   component: MyCustomComponent,
//   shouldUse: (schema) => schema.format === 'custom-format'
// };

// // Register the plugin
// pluginRegistry.register(MyCustomPlugin);

// // In your form component
// const plugin = pluginRegistry.getPlugin(fieldSchema);
// if (plugin) {
//   return <plugin.component {...fieldProps} />;
// }
