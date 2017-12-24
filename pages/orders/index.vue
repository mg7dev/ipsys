<template>
  <div class="orders my-5">
    <b-row align-h="center">
      <b-col cols="12" md="3" class="mb-3">
        <b-button-group style="width: 100%">
          <b-button
            v-for="(tab, i) in tabs"
            :key="i"
            squared
            :variant="active === tab ? 'primary' : 'outline-primary'"
            :disabled="loading"
            @click="active = tab"
            >{{ $t(tab) }}</b-button
          >
        </b-button-group>
      </b-col>
    </b-row>

    <div
      class="tab-pane show active"
      id="pills-home"
      role="tabpanel"
      aria-labelledby="pills-home-tab"
    >
      <div class="my-4 mx-0">
        <div class="row">
          <div class="col-6 d-flex align-items-center">
            <p class="m-0">
              {{ orders.length }}
              {{ $t(active + '-orders') }}
            </p>
          </div>
          <div class="col-6 text-right">
            <b-button variant="primary" squared :to="{ name: 'orders-add' }">
              + {{ $t('add-order') }}
            </b-button>
          </div>
        </div>
      </div>

      <template v-if="!loading">
        <div class="mt-4 shadow" v-for="(order, i) in orders" :key="i">
          <a @click="selectOrder(order)">
            <b-card class="p-0 p-md-2">
              <div class="row order m-0">
                <div class="col-2 col-md-1 text-center">
                  <div
                    :class="`order-number border ${
                      order.status === 'open'
                        ? 'border-danger'
                        : 'border-warning'
                    }`"
                  >
                    #{{ order.id }}
                  </div>
                </div>
                <div class="col-6 col-md-7">
                  <h6 class="m-0">{{ order.name }}</h6>
                  <p class="product mb-0">
                    {{ order.items.length ? order.items[0].product.name : '' }}
                    <b
                      v-if="order.status === 'delivered'"
                      :class="`payment-status ${order.payment_status}`"
                    >
                      ({{ $t(`invoice-${order.payment_status}`) }})</b
                    >
                  </p>
                </div>
                <div
                  class="col-4 text-right d-flex flex-wrap align-content-center justify-content-end"
                >
                  <p class="dates mb-0">
                    {{ $t('ordered') }}:
                    <b>{{ formatDate(order.created_at) }}</b
                    ><br />
                    {{
                      order.status === 'open'
                        ? $t('estimated-delivery-date')
                        : $t('delivered-at')
                    }}:
                    <b>{{
                      order.status === 'open'
                        ? formatDate(order.deliver_on)
                        : formatDateTime(order.delivered_on)
                    }}</b>
                  </p>
                </div>
              </div>
            </b-card>
          </a>
        </div>
        <div class="text-center p-5" v-if="!orders.length">
          <h3 class="text-grey font-weight-light">
            {{ $t('no-orders') }}
          </h3>
        </div>

        <b-row align-h="center">
          <b-col
            cols="12"
            class="align-items-center justify-content-center d-flex mt-4"
          >
            <b-pagination
              v-model="page"
              @input="getOrders"
              :total-rows="total"
              :per-page="limit"
            ></b-pagination>
          </b-col>
        </b-row>
      </template>
      <Loader v-if="loading" />

      <div
        :class="{ 'order-overlay': true, 'fade-lpg': orderObject }"
        v-if="id"
      >
        <div
          :class="{
            'single-order': true,
            'slide-up-lpg': orderObject,
          }"
        >
          <div class="close-order">
            <nuxt-link :to="{ query: { order: undefined } }">
              <b-icon icon="x-circle-fill"></b-icon>
            </nuxt-link>
          </div>
          <ViewOrder
            :id="id"
            :orderObject="orderObject"
            @cancelled="cancel($event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderService from '@/services/OrderService'

export default {
  name: 'Orders',

  middleware: 'authenticated',
  data() {
    return {
      active: 'open',
      tabs: ['open', 'delivered'],
      orders: [],
      loading: true,
      loadingRemove: false,
      page: 1,
      total: 0,
      limit: 10,
      orderObject: null,
      slideDown: false,
    }
  },
  head() {
    return {
      title: this.$t('my-orders'),
    }
  },
  mounted() {
    this.active = this.$route.query.status || 'open'
    if (!this.id) this.getOrders()
    this.toggleOverflow()
  },
  destroyed() {
    document.querySelector('body').style.overflowY = 'auto'
  },
  computed: {
    id() {
      return parseFloat(this.$route.query.order)
    },
  },
  methods: {
    cancel(id) {
      this.orders = this.orders.filter((o) => o.id !== id)
      this.$router.push({
        query: {
          order: undefined,
        },
      })
    },
    toggleOverflow() {
      if (this.id) {
        document.querySelector('body').style.overflowY = 'hidden'
      } else {
        document.querySelector('body').style.overflowY = 'auto'
      }
    },
    selectOrder(order) {
      this.orderObject = order
      this.$router.push({
        query: {
          order: order.id,
        },
      })
    },
    async getOrders() {
      this.orders = []
      this.loading = true
      try {
        const res = await OrderService.get({
          status: this.active,
          customer: this.currentCustomerId,
          itemsPerPage: this.limit,
          page: this.page,
        })
        this.total = res.data.total
        this.orders = res.data.data
      } catch (err) {
        console.error(err)
      }
      this.loading = false
    },
    async remove(e, id) {
      e.stopPropagation()
      if (window.confirm(this.$t('confirmation'))) {
        this.loadingRemove = id

        try {
          await OrderService.remove(id)
          this.orders = this.orders.filter((o) => o.id !== id)
        } catch (err) {}

        this.loadingRemove = false
      }
    },
  },
  watch: {
    active(tab) {
      this.$router.push({
        query: {
          status: tab,
        },
      })
    },
    '$route.query.status'() {
      this.getOrders()
    },
    '$route.query.order'(id) {
      this.toggleOverflow()

      // Get orders if single order view closed
      if (!id && !this.orders.length) {
        this.getOrders()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none !important;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slideUp {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0%);
  }
}

@keyframes slideDown {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(100%);
  }
}

.orders {
  .order-overlay {
    &.fade-lpg {
      animation: 0.3s ease fade;
    }

    content: '';
    position: relative;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 4;

    .single-order {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      margin: 0;
      padding: 10px;
      height: 90vh;
      overflow: hidden;
      border-radius: 15px 15px 0 0;
      background: white;
      z-index: 5;

      &.slide-up-lpg {
        animation: 0.25s ease-in slideUp;
      }

      &.slide-down-lpg {
        animation: 0.25s ease-in slideDown;
        transform: translateY(100%);
      }

      .close-order {
        position: absolute;
        right: 10px;
        top: 10px;

        * {
          font-size: 25px;
          color: $primary;
        }
      }

      .view-order {
        width: 100%;
      }
    }
  }

  .payment-status {
    &.paid {
      color: $success;
    }
    &.unpaid {
      color: $danger;
    }
  }
}
</style>
