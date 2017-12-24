<template>
  <div class="view-order h-100">
    <div
      class="d-flex full-width align-items-center justify-content-center"
      style="height: 90%"
      v-if="loading"
    >
      <Loader />
    </div>

    <div v-if="!loading && order" class="mt-2 mt-md-3">
      <!-- Heading -->
      <div class="text-center">
        <h2 class="mb-0 heading">{{ $t('order') }} #{{ id }}</h2>
        <p class="m-0 text-success small">
          <i class="fas fa-circle"></i> {{ $t(`order-status-${order.status}`) }}
          <b
            v-if="order.status === 'delivered'"
            :class="`payment-status ${order.payment_status}`"
          >
            ({{ $t(`invoice-${order.payment_status}`) }})</b
          >
        </p>
      </div>

      <!-- Order details -->
      <div class="my-2 mb-md-5">
        <p class="m-0 font-weight-bold">{{ $t('order-items') }}</p>
        <div class="mt-1 bg-white">
          <div class="row" v-for="item in order.items" :key="item.id">
            <div class="col-4">
              <p class="m-0">{{ item.product.name }}</p>
            </div>
            <div class="col-8 text-right">
              <strong class="heading order-item">
                <span class="item-q mx-1">x{{ item.quantity }}</span>
                <span class="item-p mx-1"
                  >{{ formatMoney(item.unit_price * item.quantity) }}
                  {{ $t('NOK') }}</span
                ></strong
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Order details -->
      <div class="my-2 mb-md-5">
        <p class="m-0 font-weight-bold">{{ $t('order-details') }}</p>
        <div class="row">
          <div class="col-7">
            <p class="m-0">{{ $t('location') }}</p>
          </div>
          <div class="col-5 text-right">
            <p
              class="text-link font-weight-bold m-0"
              data-toggle="modal"
              data-target="#location"
            >
              {{ order.location.name }}
            </p>
          </div>
        </div>
        <hr />

        <div class="row">
          <div class="col-7">
            <p class="m-0">{{ $t('ordered-at') }}</p>
          </div>
          <div class="col-5 text-right">
            <p class="m-0">{{ formatDateTime(order.created_at) }}</p>
          </div>
        </div>
        <hr />

        <div class="row" v-if="order.status === 'open'">
          <div class="col-7">
            <p class="m-0">
              {{ $t('estimated-delivery-date') }}
            </p>
          </div>
          <div class="col-5 text-right">
            <p class="m-0">
              {{ formatDate(order.deliver_on) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Price -->
      <div class="my-2 mb-md-5">
        <div class="d-flex justify-content-between align-items-center">
          <p class="m-0 font-weight-bold">
            {{ $t('price') }}
          </p>
          <p class="m-0" v-if="order.visma_human_number">
            {{ $t('invoice-no') }}
            <a :href="url" target="_blank" class="text-info"
              >#{{ order.visma_human_number }}</a
            >
          </p>
        </div>
        <div class="bg-white mt-1">
          <div class="row">
            <div class="col-7">
              <p class="m-0">{{ $t('delivery-charges') }}</p>
            </div>
            <div class="col-5 text-right">
              <p class="font-weight-bold m-0">
                {{ formatMoney(deliveryCharges) }} {{ $t('nok') }}
              </p>
            </div>
          </div>
          <hr />

          <div class="row">
            <div class="col-7">
              <p class="m-0">{{ $t('total') }}</p>
            </div>
            <div class="col-5 text-right">
              <p class="font-weight-bold m-0">
                {{ formatMoney(total) }} {{ $t('nok') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Order details if delivered -->
      <div class="my-2 mb-md-5" v-if="order.status === 'delivered'">
        <p class="m-0 font-weight-bold">
          {{ $t('delivery-details') }}
        </p>
        <div class="mt-1 bg-white">
          <div class="row">
            <div class="col-7">
              <p class="m-0">{{ $t('delivered-by') }}</p>
            </div>
            <div class="col-5 text-right">
              <p class="font-weight-bold m-0">
                {{ order.driver.name }}
              </p>
            </div>
          </div>
          <hr />
          <div class="row" v-if="order.delivered_on">
            <div class="col-7">
              <p class="m-0">{{ $t('delivered-at') }}</p>
            </div>
            <div class="col-5 text-right">
              <p class="font-weight-bold m-0">
                {{ formatDateTime(order.delivered_on) }}
              </p>
            </div>
          </div>
          <hr />
          <div class="row" v-if="order.signature">
            <div class="col-7">
              <p class="m-0">{{ $t('signature') }}</p>
            </div>
            <div class="col-5 text-right" v-if="order.status === 'delivered'">
              <img :src="signatureSource(order.signature)" class="signature" />
            </div>
          </div>
        </div>
      </div>

      <!-- <b-row v-if="order.status === 'delivered'" align-h="center">
        <b-button
          squared
          variant="primary"
          class="d-flex align-items-center"
          @click="downloadInvoice"
          :disabled="loadingPDF"
          ><b-icon icon="receipt" class="mr-1" font-scale="1"></b-icon
          >{{ $t('view-invoice') }}</b-button
        >
      </b-row> -->

      <b-row v-if="order.status === 'open'" class="mt-5">
        <b-col cols="12">
          <b-button
            class="mr-2"
            variant="primary"
            squared
            :to="{ name: 'orders-id', params: { id: order.id } }"
            >{{ $t('edit-order') }}</b-button
          >
          <b-button class="mr-2" variant="danger" squared id="cancel-button">{{
            $t('cancel-order')
          }}</b-button>

          <b-popover target="cancel-button" triggers="hover" placement="top">
            <template v-slot:title>{{ $t('cancellation-reason') }}</template>
            <b-textarea
              rows="3"
              class="mb-1"
              :placeholder="$t('cancellation-reason-placeholder')"
              v-model="reason"
            ></b-textarea>
            <b-button squared size="sm" variant="danger" @click="cancel">{{
              $t('submit')
            }}</b-button>
          </b-popover>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import OrderService from '@/services/OrderService'

export default {
  name: 'ViewOrder',
  props: {
    id: {
      type: Number,
      required: true,
    },
    orderObject: Object,
  },
  data: () => ({
    order: null,
    loading: true,
    loadingPDF: false,
    reason: '',
    url: '',
  }),
  mounted() {
    if (this.$props.orderObject) {
      this.order = this.$props.orderObject
      this.loading = false
    } else {
      this.getOrder()
    }
  },
  computed: {
    deliveryCharges() {
      if (this.order) {
        return this.order.items
          .map((item) => item.tr_unit_price)
          .reduce((acc, val) => (acc += val), 0)
      }

      return 0
    },
    total() {
      if (this.order) {
        return this.order.items
          .map((item) => item.unit_price * item.quantity + item.tr_unit_price)
          .reduce((acc, val) => (acc += val), 0)
      }

      return 0
    },
  },
  methods: {
    async downloadInvoice() {
      this.loadingPDF = true
      try {
        const res = await OrderService.getPDF(this.$route.query.order)
        this.url = res.data.url
      } catch (err) {
        console.error(err)
      }
      this.loadingPDF = false
    },
    async getOrder() {
      this.loading = true
      try {
        const res = await OrderService.show(this.$props.id)
        this.order = res.data
        if (res.data.visma_human_number) this.downloadInvoice()
      } catch (err) {}
      this.loading = false
    },
    async cancel() {
      try {
        await OrderService.cancel(this.$route.query.order, this.reason)
        this.$emit('cancelled', parseInt(this.$route.query.order))
      } catch (err) {
        console.error(err)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.view-order {
  .signature {
    max-width: 200px;
    width: 100%;
  }

  p {
    font-size: 21px;
  }

  hr {
    margin: 5px;
  }

  height: 100%;
  padding: 0 10px;
  overflow: hidden;
  overflow-y: auto;

  .order-item {
    display: flex;
    justify-content: flex-end;

    > * {
      font-size: 21px;
      color: $primary;
      padding: 0 10px;
    }

    span.item-p {
      padding-right: 0;
    }
  }

  @media (max-width: 768px) {
    .order-item * {
      font-size: 14px;
      color: $primary;
      padding: 0 5px;
    }

    p {
      font-size: 14px;
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
