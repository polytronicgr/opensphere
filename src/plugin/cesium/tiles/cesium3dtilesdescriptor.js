goog.provide('plugin.cesium.tiles.Descriptor');

goog.require('os.data.FileDescriptor');
goog.require('plugin.cesium');
goog.require('plugin.cesium.tiles');
goog.require('plugin.cesium.tiles.Provider');


/**
 * Cesium 3D tiles descriptor.
 * @extends {os.data.FileDescriptor}
 * @constructor
 */
plugin.cesium.tiles.Descriptor = function() {
  plugin.cesium.tiles.Descriptor.base(this, 'constructor');
  this.descriptorType = plugin.cesium.tiles.ID;

  /**
   * Cesium Ion asset id.
   * @type {number}
   * @protected
   */
  this.assetId = NaN;

  /**
   * Cesium Ion access token.
   * @type {string}
   * @protected
   */
  this.accessToken = '';
};
goog.inherits(plugin.cesium.tiles.Descriptor, os.data.FileDescriptor);


/**
 * @inheritDoc
 */
plugin.cesium.tiles.Descriptor.prototype.getIcons = function() {
  return plugin.cesium.tiles.ICON;
};


/**
 * @inheritDoc
 */
plugin.cesium.tiles.Descriptor.prototype.getLayerOptions = function() {
  var options = plugin.cesium.tiles.Descriptor.base(this, 'getLayerOptions');
  options['type'] = plugin.cesium.tiles.ID;

  // allow resetting the layer color to the default
  options[os.ui.ControlType.COLOR] = os.ui.ColorControlType.PICKER_RESET;

  // add Ion config
  if (!isNaN(this.assetId)) {
    options['assetId'] = this.assetId;
    options['accessToken'] = this.accessToken;
  }

  return options;
};


/**
 * Set the Ion asset configuration.
 * @param {number} assetId The asset id.
 * @param {string=} opt_accessToken The access token.
 */
plugin.cesium.tiles.Descriptor.prototype.setIonConfig = function(assetId, opt_accessToken) {
  this.assetId = assetId;

  if (opt_accessToken) {
    this.accessToken = opt_accessToken;
  }

  // set a URL so the descriptor gets persisted
  this.setUrl(plugin.cesium.ionUrl);
};


/**
 * @inheritDoc
 */
plugin.cesium.tiles.Descriptor.prototype.persist = function(opt_obj) {
  var obj = plugin.cesium.tiles.Descriptor.base(this, 'persist', opt_obj);
  obj['assetId'] = this.assetId;
  obj['accessToken'] = this.accessToken;

  return obj;
};


/**
 * @inheritDoc
 */
plugin.cesium.tiles.Descriptor.prototype.restore = function(conf) {
  if (typeof conf['assetId'] == 'number') {
    this.assetId = /** @type {number} */ (conf['assetId']);
  }

  if (conf['accessToken']) {
    this.accessToken = /** @type {string} */ (conf['accessToken']);
  }

  plugin.cesium.tiles.Descriptor.base(this, 'restore', conf);
};


/**
 * Creates a new descriptor from a parser configuration.
 * @param {!Object} config
 * @return {!plugin.cesium.tiles.Descriptor}
 */
plugin.cesium.tiles.Descriptor.createFromConfig = function(config) {
  var file = /** @type {os.file.File|undefined} */ (config['file']);
  var provider = plugin.cesium.tiles.Provider.getInstance();
  var descriptor = new plugin.cesium.tiles.Descriptor();
  descriptor.setId(provider.getUniqueId());
  descriptor.setProvider(provider.getLabel());

  if (file) {
    descriptor.setUrl(file.getUrl());
  }

  plugin.cesium.tiles.Descriptor.updateFromConfig(descriptor, config);

  return descriptor;
};


/**
 * Updates an existing descriptor from a parser configuration.
 * @param {!plugin.cesium.tiles.Descriptor} descriptor
 * @param {!Object} config
 */
plugin.cesium.tiles.Descriptor.updateFromConfig = function(descriptor, config) {
  descriptor.setColor(config['color']);
  descriptor.setDescription(config['description']);
  descriptor.setTitle(config['title']);
  descriptor.setTags(config['tags'] ? config['tags'].split(/\s*,\s*/) : null);

  if (typeof config['assetId'] == 'number') {
    descriptor.setIonConfig(
        /** @type {number} */ (config['assetId']),
        /** @type {string|undefined} */ (config['accessToken']));
  }
};
