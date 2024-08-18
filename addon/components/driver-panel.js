import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isArray } from '@ember/array';
import DriverPanelDetailComponent from './driver-panel/details';
import DriverPanelOrdersComponent from './driver-panel/orders';
import contextComponentCallback from '@fleetbase/ember-core/utils/context-component-callback';
import applyContextComponentArguments from '@fleetbase/ember-core/utils/apply-context-component-arguments';

export default class DriverPanelComponent extends Component {
    /**
     * Service for fetching data.
     *
     * @type {Service}
     */
    @service fetch;

    /**
     * Service for managing modals.
     *
     * @type {Service}
     */
    @service modalsManager;

    /**
     * Universe service for managing global data and settings.
     *
     * @type {Service}
     */
    @service universe;

    /**
     * Ember data store service.
     *
     * @type {Service}
     */
    @service store;

    /**
     * Service for managing routing within the host app.
     *
     * @type {Service}
     */
    @service hostRouter;

    /**
     * Service for managing the context panel.
     *
     * @type {Service}
     */
    @service contextPanel;

    /**
     * The current active tab.
     *
     * @type {Object}
     * @tracked
     */
    @tracked tab;

    /**
     * The driver being displayed or edited.
     *
     * @type {DriverModel}
     * @tracked
     */
    @tracked driver;

    /**
     * Returns the array of tabs available for the panel.
     *
     * @type {Array}
     */
    get tabs() {
        const registeredTabs = this.universe.getMenuItemsFromRegistry('component:driver-panel');
        // this.universe._createMenuItem('Tracking', null, { icon: 'satellite-dish', component: DriverPanelTrackingComponent }),
        const defaultTabs = [
            this.universe._createMenuItem('Details', null, { icon: 'circle-info', component: DriverPanelDetailComponent }),
            this.universe._createMenuItem('Orders', null, { icon: 'bars-progress', component: DriverPanelOrdersComponent }),
        ];
        if (isArray(registeredTabs)) {
            return [...defaultTabs, ...registeredTabs];
        }

        return defaultTabs;
    }

    /**
     * Initializes the driver panel component.
     */
    constructor() {
        super(...arguments);
        this.driver = this.args.driver;
        this.tab = this.getTabUsingSlug(this.args.tab);
        applyContextComponentArguments(this);
    }

    /**
     * Sets the overlay context.
     *
     * @action
     * @param {OverlayContextObject} overlayContext
     */
    @action setOverlayContext(overlayContext) {
        this.context = overlayContext;
        contextComponentCallback(this, 'onLoad', ...arguments);
    }

    /**
     * Handles changing the active tab.
     *
     * @method
     * @param {String} tab - The new tab to switch to.
     * @action
     */
    @action onTabChanged(tab) {
        this.tab = this.getTabUsingSlug(tab);
        contextComponentCallback(this, 'onTabChanged', tab);
    }

    /**
     * Handles edit action for the driver.
     *
     * @method
     * @action
     */
    @action onEdit() {
        const isActionOverrided = contextComponentCallback(this, 'onEdit', this.driver);

        if (!isActionOverrided) {
            this.contextPanel.focus(this.driver, 'editing', {
                onAfterSave: () => {
                    this.contextPanel.clear();
                },
            });
        }
    }

    /**
     * Handles the cancel action.
     *
     * @method
     * @action
     * @returns {Boolean} Indicates whether the cancel action was overridden.
     */
    @action onPressCancel() {
        return contextComponentCallback(this, 'onPressCancel', this.driver);
    }

    /**
     * View the driver's assigned vehicle.
     *
     * @memberof DriverPanelComponent
     */
    @action onClickDriverVehicle() {
        const { vehicle } = this.driver;

        if (vehicle) {
            this.contextPanel.focus(vehicle);
        }
    }

    /**
     * Finds and returns a tab based on its slug.
     *
     * @param {String} tabSlug - The slug of the tab.
     * @returns {Object|null} The found tab or null.
     */
    getTabUsingSlug(tabSlug) {
        if (tabSlug) {
            return this.tabs.find(({ slug }) => slug === tabSlug);
        }

        return this.tabs[0];
    }
}
