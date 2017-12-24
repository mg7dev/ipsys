import Vue from 'vue'

import errMixin from '@/mixins/err'
import customerMixin from '@/mixins/customer'
import dateMixin from '@/mixins/date'
import moneyMixin from '@/mixins/money'
import urlMixin from '@/mixins/url'

import { FadeTransition } from 'vue2-transitions'

Vue.mixin({
  components: {
    FadeTransition,
  },
  mixins: [errMixin, customerMixin, dateMixin, moneyMixin, urlMixin],
})
