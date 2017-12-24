import numeral from 'numeral'
export default {
  methods: {
    formatMoney(amount) {
      const hasDecimalPlaces =
        parseFloat(amount).toFixed(0) / parseFloat(amount) === 1 ? false : true
      amount = numeral(amount).format(`0,0${hasDecimalPlaces ? '.00' : ''}`)
      return amount.replace(/[.,]/g, function (x) {
        return x == ',' ? '.' : ','
      })
    },
  },
}
