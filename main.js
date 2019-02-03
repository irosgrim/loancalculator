// I did the first version without currency formatting inside input and that was quite easy.
// The challenge was currency formatting in the input boxes and that took a lot of time.
// There are things that can be improoved, of course.

Vue.component('cashform', {
  props: ['value'],
  template: `
        <div class="row">
                    <button class="calculator-button" v-on:click="decrementAmount">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16">
                          <path
                            fill="none"
                            fill-rule="nonzero"
                            stroke="#FFF"
                            stroke-linecap="round"
                            stroke-width="2"
                            d="M1 1.5h15"
                          />
                        </svg>
                      
                    </button>
          
                    <input type="text" 
                           v-model="amountToLoan" 
                           v-on:keyup.enter="amountInputActive = false" 
                           v-on:click="amountInputActive = true"
                           v-on:blur="amountInputActive = false"
                           />
          
                    <button class="calculator-button" v-on:click="incrementAmount">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="22">
                          <path
                            fill="none"
                            stroke="#FFF"
                            stroke-linecap="round"
                            stroke-width="2"
                            d="M1 8.5h15M8.5 1v15"
                          />
                        </svg>
                    </button>
                  </div>
        `,
  data: function() {
    return {
      amountInputActive: false
    };
  },
  methods: {
    incrementAmount: function() {
      if (this.$parent.amountToLoan < 600000) {
        this.$parent.amountToLoan += 5000;
      }
    },
    decrementAmount: function() {
      if (this.$parent.amountToLoan > 5000) {
        this.$parent.amountToLoan -= 5000;
      }
    }
  },
  computed: {
    amountToLoan: {
      //when we call the method
      get: function() {
        if (this.amountInputActive) {
          return this.value.toString();
        } else {
          //format
          return (
            this.value.toLocaleString('se').replace(/,/g, ' ') +
            this.$parent.labels.monthlyCostSuffix
          );
        }
      },
      //called when we change the value
      set: function(modifiedValue) {
        // make it number again
        let newValue = parseFloat(modifiedValue.replace(/[^\d\s]/g, ''));
        // Ensure that it is not NaN
        if (isNaN(newValue)) {
          newValue = 0;
        }
        //show the new value
        this.$emit('input', newValue);
      }
    }
  }
});

Vue.component('yearsform', {
  props: ['value'],
  template: `
        <div class="row">
                    <button class="calculator-button" v-on:click="decrementAmount">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16">
                          <path
                            fill="none"
                            fill-rule="nonzero"
                            stroke="#FFF"
                            stroke-linecap="round"
                            stroke-width="2"
                            d="M1 1.5h15"
                          />
                        </svg>
                    </button>
          
                    <input type="text" 
                           v-model="lengthToLoan" 
                           v-on:keyup.enter="yearsInputActive = false" 
                           v-on:click="yearsInputActive = true"
                           v-on:blur="yearsInputActive = false"
                           />
                           
                    <button class="calculator-button" v-on:click="incrementAmount">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="22">
                          <path
                            fill="none"
                            stroke="#FFF"
                            stroke-linecap="round"
                            stroke-width="2"
                            d="M1 8.5h15M8.5 1v15"
                          />
                        </svg>
                    </button>
                  </div>
        `,
  data: function() {
    return {
      yearsInputActive: false
    };
  },
  methods: {
    incrementAmount: function() {
      if (this.$parent.yearsToLoan < 15) {
        this.$parent.yearsToLoan += 1;
      }
    },
    decrementAmount: function() {
      if (this.$parent.yearsToLoan > 1) {
        this.$parent.yearsToLoan -= 1;
      }
    }
  },
  computed: {
    lengthToLoan: {
      get: function() {
        if (this.yearsInputActive) {
          return this.value.toString();
        } else {
          //format
          return this.value + this.$parent.labels.repaymentYearsSuffix;
        }
      },
      set: function(modifiedValue) {
        // make it number again
        let newValue = parseFloat(modifiedValue.replace(/[^\d\s]/g, ''));
        // Ensure that it is not NaN
        if (isNaN(newValue)) {
          newValue = 0;
        }
        this.$emit('input', newValue);
      }
    }
  }
});

new Vue({
  el: '#app',
  data: function() {
    return {
      amountToLoan: 250000,
      yearsToLoan: 14,
      monthlyCostTotal: 0
    };
  },
  methods: {
    calculateMonthlyCost: function() {
      var months = this.yearsToLoan * 12;
      var loanAmount = this.amountToLoan;
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
        monthlyCostSuffix: ' kr',
        loanAmountLabel: 'Lånebelopp',
        loanAmountSuffix: ' kr',
        repaymentYearsLabel: 'Återbetalningstid',
        repaymentYearsSuffix: ' år',
        ctaLabel: 'Ansök nu',
        interest: 5.77
      };
    }
  },
  watch: {
    amountToLoan: function(val) {
      this.calculateMonthlyCost();
    },
    yearsToLoan: function(val) {
      this.calculateMonthlyCost();
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.calculateMonthlyCost();
    });
  }
});
