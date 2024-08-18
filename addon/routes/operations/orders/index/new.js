import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class OperationsOrdersIndexNewRoute extends Route {
    @service store;

    @action willTransition() {
        if (this.controller) {
            this.controller.resetForm();
        }
    }

    async setupController(controller) {
        controller.orderConfigs = await this.store.findAll('order-config');
    }
}
