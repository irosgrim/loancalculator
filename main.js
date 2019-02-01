var app = new Vue({
  el: '#app',
  data: {
    loanAmount: 250000,
    repaymentYears: 14,
    repaymentFormated: '',
    monthlyCostTotal: 0
  },
  methods: {
    increaseAmountToLoan: function() {
      if (this.loanAmount < 600000) {
        this.loanAmount += 5000;
        this.calculateMonthlyCost();
      }
    },
    decreaseAmountToLoan: function() {
      if (this.loanAmount > 5000) {
        this.loanAmount -= 5000;
        this.calculateMonthlyCost();
      }
    },
    increaseYears: function() {
      if (this.repaymentYears < 15) {
        this.repaymentYears += 1;
        this.calculateMonthlyCost();
      }
    },
    decreaseYears: function() {
      if (this.repaymentYears > 1) {
        this.repaymentYears -= 1;
        this.calculateMonthlyCost();
      }
    },
    calculateMonthlyCost: function() {
      var months = this.repaymentYears * 12;
      var loanAmount = this.loanAmount;
      var interest = this.labels.interest;

      var totalPerMonth = Math.round(
        (loanAmount * (interest / 100)) /
          12 /
          (1 - Math.pow(1 + interest / 100 / 12, months * -1))
      );
      this.monthlyCostTotal = totalPerMonth
        .toLocaleString('se')
        .replace(/,/g, ' ');
    }
  },
  computed: {
    labels() {
      return {
        monthlyCostLabel: 'Månadskostnad',
        monthlyCostSuffix: 'kr',
        loanAmountLabel: 'Lånebelopp',
        loanAmountSuffix: ' kr',
        repaymentYearsLabel: 'Återbetalningstid',
        repaymentYearsSuffix: 'år',
        ctaLabel: 'Ansök nu',
        interest: 5.77
      };
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.calculateMonthlyCost();
    });
  }
});
