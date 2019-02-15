Vue.component('inpt-form', {
	props: {
		buttonlabel: String,
		min: Number,
		max: Number,
		step: Number,
		value: Number,
		default: Number,
		suffix: String
	},
	data: function() {
		return {
			inptActive: false
		};
	},
	methods: {
		increase: function() {
			if (this.value < this.max) {
				this.value += this.step;
				this.$emit('input', Number(this.value));
			}
		},
		decrease: function() {
			if (this.value > this.min) {
				this.value -= this.step;
				this.$emit('input', Number(this.value));
			}
		}
	},
	computed: {
		counter: {
			get: function() {
				if (this.inptActive) {
					return this.value.toString();
				} else {
					//format
					return (
						this.value.toLocaleString('se').replace(/,/g, ' ') + this.suffix
					);
				}
			},
			set: function(modifiedValue) {
				// make it number again
				let newValue = parseFloat(modifiedValue.replace(/[^\d\s]/g, ''));
				// Ensure that it is not NaN
				if (isNaN(newValue)) {
					newValue = 0;
				}
				this.value = newValue;
				this.$emit('input', newValue);
			}
		}
	},
	template: `
    <div class="row">
    <button class="calculator-button" v-on:click="decrease">
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
           v-model:value="counter" 
           v-on:keyup.enter="inptActive = false" 
           v-on:click="inptActive = true"
           v-on:blur="inptActive = false"
           />   
    <button class="calculator-button" v-on:click="increase">
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
   `
});

// ------------ parent

var app = new Vue({
	el: '#app',
	data: {
		years: 14,
		amountToLoan: 250000,
		monthlyCostTotal: 0
	},
	methods: {
		calculateMonthlyCost: function() {
			var months = this.years * 12;
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
				cashSuffix: ' kr',
				loanAmountLabel: 'Lånebelopp',
				repaymentYearsLabel: 'Återbetalningstid',
				yearsSuffix: ' år',
				ctaLabel: 'Ansök nu',
				interest: 5.77
			};
		}
	},
	watch: {
		amountToLoan: function(val) {
			this.calculateMonthlyCost();
		},
		years: function(val) {
			this.calculateMonthlyCost();
		}
	},
	mounted: function() {
		this.$nextTick(function() {
			this.calculateMonthlyCost();
		});
	}
});
