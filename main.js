var eventBus = new Vue

Vue.component('product', {
  props: {
    premium:{
      required: true,
      type: Boolean
    }
  },
  template:`
  <div class="product">
    <div class="product-image">
      <img v-bind:src="image" v-bind:alt="altText">
    </div>
    <div class="produc-info">
      <h1 :style="[styleObject, styleObject2]">{{ title }}</h1>
      <p>Socks on sale {{inventory}}</p>
      <p v-if="inventory > 10">In stock</p>
      <p v-else-if="inventory <= 10 && inventory > 0" >Allmost sold out!</p>
      <p v-else>Out of inventory</p>

      <product-infos :shipping="shipping" :details="details"></product-infos>
      
      <h3>Sizes on sale</h3>
      <div v-for="size in sizes">
        <ul>
          <li>{{ size }}</li>
        </ul>
      </div>

      <h3 :style="propiedades">colors on sale</h3>
      
      <div>
        <p v-show="inStock">On Sale!</p>
        <!-- <p class="outOfStock" v-show="!inStock">On sale!</p> -->
        <p :class="{outOfStock: !inStock}" v-show="!inStock">Out of Sale!</p>
      </div>
      <button 
        type="button" 
        v-on:click="addOneCart"
        :disabled="!inStock"
        :class="{disabledButton: !inStock}">
        Add Cart
      </button>
        <button type="button" @click="subtractOneCart">Subtract Cart</button>
        <button type="button" @click="deleteCart">Delete</button>
        <button type="button" @click="deleteLastCart">Delete</button>
     </div>
      <a v-bind:href="link">More products</a>
      <div>

      <product-tabs :reviews="reviews"></product-tabs>

      </div>
  </div>
  `,
  data(){
    return {
      product: 'Socks',
      selectedVariant: 0,
      brand: "Vue Mastery",
      propiedades:{
        color: 'red',
        background: 'yellow'
      },
      textDecoration: 'line-through',
      altText: 'A pair of socks',
      link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
      inventory: 5,
      styleObject:{
        color: 'red',
        fontSize: 'bold'
      },
  
      styleObject2:{
        textDecoraton: 'underline',
        fontFamily: 'Helvetica'
      },
      // onSale: true,
      details:["80% cotton", "20% polyester", "Gender-neutral"],
      sizes: [10, 20, 30],
      variants:[
        {
          variantID: 2234,
          variantColor: "green",
          variantImage: './image/vmSocks-green-onWhite.jpg',
          variantQuantity: 10,
          variantOnSale: true
        },
        {
          variantID: 2235,
          variantColor: "blue",
          variantImage: './image/vmSocks-blue-onWhite.jpg',
          variantQuantity: 0,
          variantOnSale: false
         },
      ],
      reviews: []
    }
  },
    methods:{
      addOneCart(){
        this.$emit('add-one-cart', this.variants[this.selectedVariant].variantID)
      },
      subtractOneCart(){
        this.$emit('subtract-one-cart', this.variants[this.selectedVariant].variantID)
      },
      deleteCart(){
        this.$emit('delete-cart')
      },
      deleteLastCart(){
        this.$emit('delete-last-cart', this.variants[this.selectedVariant].variantID)
      }
    },
    computed: {
      title() {
        return this.brand + ' ' + this.product
      },
      image(){
        return this.variants[this.selectedVariant].variantImage
      },
      inStock(){
        return this.variants[this.selectedVariant].variantQuantity
      },
      onSale(){
        return this.variants[this.selectedVariant].variantOnSale
      },
      shipping(){
        if(this.premium){
          return 'Free'
        }
        return '2.99 €'
      }
    },
    mounted(){
      eventBus.$on('review-submitted', productReview => {
        this.reviews.push(productReview)
      })
    }
})
Vue.component('product-review',{
  template:`
  <form class="review-form" @submit.prevent="onSubmit">
  <p>
    <label for="name">Name:</label>
    <input id="name" v-model="name" placeholder="name">
  </p>
  
  <p>
    <label for="review">Review:</label>      
    <textarea placeholder="Review" id="review" v-model="review"></textarea>
  </p>
  
  <p>
    <label for="rating">Rating:</label>
    <select id="rating" v-model.number="rating">
      <option>5</option>
      <option>4</option>
      <option>3</option>
      <option>2</option>
      <option>1</option>
    </select>
  </p>

  <p>
    <label for='question'>Would you recommend this product?</label>
      <select id="question" v-model="question">
        <option>Yes</option>
        <option>No</option>
      </select>
  </p>
  <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="question"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="question"/>
        </label>
      
  <p>
  <p>Send</p>
    <input type="submit" value="Submit"> 
  </p>    

  <p v-if="errors.length">
    <ul>
      <li v-for="error in errors">{{error}}</li>
    </ul>
  </p>

</form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      question: null,
      errors: []
    }
  },
  methods:{
    onSubmit(){
      if(this.name && this.review && this.rating && this.question){
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          question: this.question
        }
        // console.log(productReview)
        eventBus.$emit('review-submitted', productReview)
        this.name = null
        this.review = null
        this.rating = null
        this.question = null
        }
      else{
        if(!this.name){
          this.errors.push("Name requiered!")
        }
        if(!this.review){
          this.errors.push("Review requiered!")
        }
        if(!this.rating){
          this.errors.push("Rating requiered!")
        }
        if(!this.question){
          this.errors.push("Question requiered!")
        }
      } 
    }
  }
})

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
})

Vue.component('product-infos',{
  props:{
    shipping:{
      requiered: true,
      type: String
    },
    details:{
      type: Array,
      requiered: true
    }

  },
  template:`
      <div>
        <div>
          <span 
            class="tab"
            :class="{activeTab: selectedTab === tab}"
            v-for="(tab, index) in tabs"
            :key='index'
            @click="selectedTab = tab">
            {{ tab }}
          </span>
        </div>
        <div v-show="selectedTab === 'Shipping'">
          <p>Price: {{ shipping }}</p>
        </div>

        <div v-show="selectedTab === 'Details'">
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
        </div>
      </div>
  `,
  data(){
    return{
      tabs:['Shipping', 'Details'],
      selectedTab: 'shipping'
    }
  }
})

Vue.component('product-tabs',{
  props:{
    reviews:{
      requiered: true,
      type: Array
    }
  },
  template:`
    <div>
      <div>
        <span 
          class="tab"
          :class="{activeTab:selectedTab === tab}"
          v-for="(tab, index) in tabs"
          :key='index'
          @click="selectedTab = tab">
          {{ tab }}
        </span>
      </div>
      <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul v-else>
          <li v-for="(review, index) in reviews">
            <p>Name: {{review.name}}</p>
            <p>Rating: {{review.rating}}</p>
            <p>{{review.review}}</p>
            <p>Recommend: {{review.question}}</p>
          </li>
        </ul>
      </div>
      <product-review v-show="selectedTab === 'Make a Review'"></product-review>
    </div>
  `,
  data(){
    return{
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    }
  }
})


var app = new Vue({
  el: '#app',
  data:{
    premium: false,
    cart: []
  },
  methods:{
    updateAddCart(id){
      this.cart.push(id)
    },
    updateSubtractCart(id){
      this.cart.pop(id)
    },
    deleteAllCarts(){
      this.cart = []
    },
    deleteOneCart(id){
      console.log(this.cart)
      for(var i = this.cart.length - 1; i >=0; i--){
        if(this.cart[i] === id){
          this.cart.splice(i, 1)
        }
      }
    }
  }
})

