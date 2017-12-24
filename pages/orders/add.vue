<template>
  <div v-if="!loading || !loadingCredit">
    <div class="orders-add mt-5" v-if="hasMoreCredit()">
      <div class="text-center">
        <h3 class="mb-0 heading">{{ $t('add-order') }}</h3>
      </div>
      <strong class="heading">{{ $t('location') }}</strong>
      <b-form-select
        v-model="location"
        :options="locationsDropdown"
      ></b-form-select>
      <hr />

      <div
        :class="`shadow order-item my-2 ${errorItem === i ? 'error' : ''}`"
        v-for="(item, i) in added.items"
        :key="i"
      >
        <button
          class="remove-item"
          v-if="added.items.length > 1"
          @click="removeItem(i)"
        >
          <b-icon icon="x-circle-fill"></b-icon>
        </button>
        <b-row class="mb-3">
          <b-col cols="12 mb-1">
            <strong class="heading">{{ $t('order-type') }}</strong>
          </b-col>
          <b-col cols="12 mb-2">
            <b-button-group>
              <b-button
                :variant="
                  added.items[i].group === group ? 'primary' : 'transparent'
                "
                squared
                class="mr-1 mt-1"
                v-for="(group, idx) in groups"
                :key="idx"
                @click="added.items[i].group = group"
              >
                <input
                  class="mr-1"
                  type="radio"
                  :checked="added.items[i].group === group"
                />
                {{ group.name }}
              </b-button>
            </b-button-group>
          </b-col>
        </b-row>
        <template v-if="added.items[i].group">
          <b-row class="mb-3">
            <b-col cols="12 mb-1">
              <strong class="heading">{{ $t('order-item') }}</strong>
            </b-col>
            <b-col cols="12">
              <b-button-group>
                <b-button
                  :variant="
                    added.items[i].product === product
                      ? 'primary'
                      : 'transparent'
                  "
                  squared
                  class="mr-1 mt-1"
                  v-for="(product, idx) in groupItems(i)"
                  :key="idx"
                  @click="added.items[i].product = product"
                >
                  <input
                    class="mr-1"
                    type="radio"
                    :checked="added.items[i].product === product"
                  />
                  {{ product.name }}
                </b-button>
              </b-button-group>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col cols="12 mb-1">
              <strong class="heading">{{ $t('quantity') }}</strong>
            </b-col>
            <b-col cols="12" md="5">
              <b-input
                type="number"
                v-model="added.items[i].quantity"
              ></b-input>
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
          :disabled="loadingAdd"
          @click="add"
          >{{ $t('add-order') }}</b-button
        >
      </div>
    </div>
    <div v-if="!hasMoreCredit()">
      <div class="alert alert-danger my-5">
        <i18n path="credit-limit-reached-message" tag="p" class="m-0">
          <template #phone>
            <a href="tel:+4721080620">21 08 06 20</a>
          </template>
          <template #email>
            <a href="mailto:hei@lpgoslo.no">hei@lpgoslo.no</a>
          </template>
        </i18n>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from '@/services/UserService'
import CustomerService from '@/services/CustomerService'
import OrderService from '~/services/OrderService'

export default {
  name: 'orders-add',
  data() {
    return {
      location: null,
      groups: [],
      loading: true,
      loadingCredit: true,
      group: null,
      product: null,
      quantity: 1,
      loadingAdd: false,
      errorItem: null,
      added: {
        items: [{ group: null, product: null, quantity: 0 }],
      },
      credit: 0,
      creditLimit: 0,
    }
  },
  head() {
    return {
      title: this.$t('add-order'),
    }
  },
  mounted() {
    if (this.locationsDropdown.length) {
      this.location = this.locationsDropdown[0].value
    }
    this.getProductGroups()
    this.getCredit()
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
    hasMoreCredit() {
      return this.credit < this.creditLimit || this.creditLimit === 0
    },
    async getCredit() {
      this.loadingCredit = true
      try {
        const res = await CustomerService.getCredit(this.currentCustomerId)
        this.credit = res.data.credit
        this.creditLimit = res.data.limit
      } catch (err) {
        console.error(err)
      }
      this.loadingCredit = false
    },
    addItem() {
      this.added.items.push({ group: null, product: null, quantity: 0 })
    },
    removeItem(idx) {
      this.added.items = this.added.items.filter((_, i) => i !== idx)
    },
    groupItems(i) {
      if (this.added.items[i].group) {
        return this.added.items[i].group.products
      }

      return []
    },
    async getProductGroups() {
      this.loading = true
      try {
        const res = await UserService.getProductGroups()
        this.groups = res.data
        this.added.items = this.added.items.map((item) => ({
          ...item,
          group: res.data[0],
        }))
      } catch (err) {}
      this.loading = false
    },
    async add() {
      this.errorItem = null
      this.added.items.forEach((item, i) => {
        if (!item.group || !item.product || !item.quantity) {
          this.errorItem = i
          return
        }
      })

      if (this.errorItem === null) {
        this.loadingAdd = true

        try {
          await OrderService.create({
            items: this.added.items.map((item) => ({
              ...item,
              product: item.product.id,
              group: item.group.id,
            })),
            customer: this.currentCustomerId,
            location: this.location,
          })
          this.$router.push({
            name: 'orders',
          })
        } catch (err) {}

        this.loadingAdd = false
      }
    },
  },
}
</script>

<style lang="scss">
.orders-add {
  .custom-radio {
    margin-bottom: 5px !important;
  }

  .order-item {
    padding: 15px;
    background: white;
    // border: 1px solid rgba($color: $primary, $alpha: 0.5);
    // border-radius: 12px;
    // background: rgba($color: $primary, $alpha: 0.5);
    position: relative;

    &.error {
      border: 3px solid rgba($color: $danger, $alpha: 0.8);
    }

    button.remove-item {
      z-index: 10;
      position: absolute;
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