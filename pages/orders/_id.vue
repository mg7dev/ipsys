<template>
  <div class="orders-edit mt-5" v-if="!loading">
    <div class="text-center">
      <h3 class="mb-0 heading">{{ $t('edit-order') }}</h3>
    </div>
    <strong class="heading">{{ $t('location') }}</strong>
    <b-form-select
      v-model="location"
      :options="locationsDropdown"
    ></b-form-select>
    <hr />

    <div
      :class="`order-item shadow my-2 ${errorItem === i ? 'error' : ''}`"
      v-for="(item, i) in edited.items"
      :key="i"
    >
      <button
        class="remove-item"
        v-if="edited.items.length > 1"
        @click="removeItem(i)"
      >
        <b-icon icon="x-circle-fill"></b-icon>
      </button>
      <b-row class="mb-3">
        <b-col cols="12 mb-2">
          <strong class="heading">{{ $t('order-type') }}</strong>
        </b-col>
        <b-col cols="12 mb-2">
          <b-button-group>
            <b-button
              :variant="
                edited.items[i].group === group.id ? 'primary' : 'transparent'
              "
              squared
              class="mr-1 mt-1"
              v-for="(group, idx) in groups"
              :key="idx"
              @click="edited.items[i].group = group.id"
            >
              <input
                class="mr-1"
                type="radio"
                :checked="edited.items[i].group === group.id"
              />
              {{ group.name }}
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>
      <template v-if="edited.items[i].group">
        <b-row class="mb-3">
          <b-col cols="12 mb-2">
            <strong class="heading">{{ $t('order-item') }}</strong>
          </b-col>
          <b-col cols="12 mb-2">
            <b-button-group>
              <b-button
                :variant="
                  edited.items[i].product === product.id
                    ? 'primary'
                    : 'transparent'
                "
                squared
                class="mr-1 mt-1"
                v-for="(product, idx) in groupItems(i)"
                :key="idx"
                @click="edited.items[i].product = product.id"
              >
                <input
                  class="mr-1"
                  type="radio"
                  :checked="edited.items[i].product === product.id"
                />
                {{ product.name }}
              </b-button>
            </b-button-group>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col cols="12">
            <strong class="heading">{{ $t('quantity') }}</strong>
          </b-col>
          <b-col cols="12" md="5">
            <b-input type="number" v-model="edited.items[i].quantity"></b-input>
          </b-col>
        </b-row>
      </template>
    </div>

    <b-row align-h="end" class="mt-2 mt-md-4">
      <b-col cols="4" md="4" lg="3">
        <b-button variant="primary" squared block @click="addItem"
          >+ {{ $t('add-item') }}</b-button
        >
      </b-col>
    </b-row>

    <div class="p-5 text-center">
      <b-button
        variant="primary"
        squared
        :disabled="loadingedit"
        @click="edit"
        >{{ $t('save-changes') }}</b-button
      >
    </div>
  </div>
</template>

<script>
import UserService from '@/services/UserService'
import OrderService from '~/services/OrderService'

import _ from 'lodash'

export default {
  name: 'OrdersEdit',

  data() {
    return {
      location: null,
      groups: [],
      loading: true,
      loadingedit: false,
      errorItem: null,
      edited: {
        items: [],
      },
      order: null,
    }
  },
  head() {
    return {
      title: this.$t('edit-order'),
    }
  },
  mounted() {
    this.getProductGroups()
    this.getOrder()
  },
  computed: {
    locationsDropdown() {
      if (this.currentCustomer.locations) {
        return this.currentCustomer.locations.map((l) => ({
          text: l.name,
          value: l.id,
        }))
      }

      return []
    },
  },
  methods: {
    async getOrder() {
      this.loading = true
      try {
        const res = await OrderService.show(this.$route.params.id)
        this.order = res.data
        this.location = this.order.location_id
        this.edited.items = this.order.items.map((item) => ({
          group: item.product_group_id,
          product: item.product_id,
          quantity: item.quantity,
        }))
      } catch (err) {}
      this.loading = false
    },
    addItem() {
      this.edited.items.push({ group: null, product: null, quantity: 0 })
    },
    removeItem(idx) {
      this.edited.items = this.edited.items.filter((_, i) => i !== idx)
    },
    groupItems(i) {
      if (this.edited.items[i].group) {
        const group = _.find(
          this.groups,
          (o) => o.id === this.edited.items[i].group
        )

        if (group) {
          return group.products
        }
      }

      return []
    },
    async getProductGroups() {
      this.loading = true
      try {
        const res = await UserService.getProductGroups()
        this.groups = res.data
        this.edited.items = this.edited.items.map((item) => ({
          ...item,
          group: res.data[0],
        }))
      } catch (err) {}
      this.loading = false
    },
    async edit() {
      this.errorItem = null
      this.edited.items.forEach((item, i) => {
        if (!item.group || !item.product || !item.quantity) {
          this.errorItem = i
          return
        }
      })

      if (this.errorItem === null) {
        this.loadingedit = true

        try {
          await OrderService.update(this.$route.params.id, {
            items: this.edited.items.map((item) => ({
              ...item,
              product: item.product,
              group: item.group,
            })),
            customer: this.currentCustomerId,
            location: this.location,
          })
          this.$router.push({
            name: 'orders',
            query: {
              order: this.$route.params.id,
            },
          })
        } catch (err) {}

        this.loadingedit = false
      }
    },
  },
}
</script>

<style lang="scss">
.orders-edit {
  .custom-radio {
    margin-bottom: 5px !important;
  }

  .order-item {
    padding: 15px;
    // border: 1px solid rgba($color: $primary, $alpha: 0.5);
    background: white;

    // border-radius: 12px;
    // background: rgba($color: $primary, $alpha: 0.5);
    position: relative;

    &.error {
      border: 3px solid rgba($color: $danger, $alpha: 0.8);
    }

    button.remove-item {
      z-index: 10;
      position: absolute;
      background: white;

      right: 10px;
      top: 10px;
      color: $primary;
      border: none;
      cursor: pointer;

      > * {
        color: $primary !important;
        font-size: 25px;
      }
    }
  }
}
</style>