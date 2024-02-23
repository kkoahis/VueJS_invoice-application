<template>
    <div class="container">
        <div class="invoices">
            <div class="card__header">
                <div>
                    <h2 class="invoice__title">New Invoice</h2>
                </div>
                <div>

                </div>
            </div>

            <div class="card__content">
                <div class="card__content--header">
                    <div>
                        <p class="my-1">Customer</p>
                        <select name="" id="" class="input" v-model="customer_id">
                            <option value="" disabled>Select customer</option>
                            <option :value="customer.id" v-for="customer in customers" :key="customer.id">
                                {{ customer.firstname }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <p class="my-1">Date</p>
                        <input id="date" placeholder="dd-mm-yyyy" type="date" class="input" v-model="date" name="date">
                        <div v-if="emptyField" style="color: red;padding: 10px;">{{ emptyField }}</div>
                        <p class="my-1">Due Date</p>
                        <input id="due_date" type="date" class="input" v-model="due_date">
                        <div v-if="emptyField" style="color: red;padding: 10px;">{{ emptyField }}</div>
                    </div>
                    <div>
                        <p class="my-1">Numero</p>
                        <input type="text" class="input" v-model="number">
                        <p v-if="emptyField" style="color: red;padding: 10px;">{{ emptyField }}</p>
                        <p class="my-1">Reference(Optional)</p>
                        <input type="text" class="input" v-model="reference">
                        <p v-if="emptyField" style="color: red;padding: 10px;">{{ emptyField }}</p>
                    </div>
                </div>
                <br><br>
                <div class="table">

                    <div class="table--heading2">
                        <p>Item Description</p>
                        <p>Unit Price</p>
                        <p>Qty</p>
                        <p>Total</p>
                        <p></p>
                    </div>

                    <!-- item 1 -->
                    <div class="table--items2" v-for="(itemCart) in listCart" :key="itemCart.id">
                        <p>#{{ itemCart.item_code }} {{ itemCart.description }}</p>
                        <p>
                            <input type="text" class="input" v-model="itemCart.unit_price" disabled>
                        </p>
                        <p>
                            <input type="text" class="input" v-model="itemCart.quantity">
                        </p>
                        <p v-if="itemCart.quantity">
                            $ {{ itemCart.quantity * itemCart.unit_price }}
                        </p>
                        <p v-else></p>
                        <p style="color: red; font-size: 24px;cursor: pointer;" @click="removeItem(i)">
                            &times;
                        </p>
                    </div>
                    <div style="padding: 10px 30px !important;">
                        <button class="btn btn-sm btn__open--modal" @click="openModal()">
                            Add New Line
                        </button>
                    </div>
                </div>

                <div class="table__footer">
                    <div class="document-footer">
                        <p>Terms and Conditions</p>
                        <textarea cols="50" rows="7" class="textarea" v-model="terms"></textarea>
                    </div>
                    <div>
                        <div class="table__footer--subtotal">
                            <p>Sub Total</p>
                            <span>$ {{ subTotal() }}</span>
                        </div>
                        <div class="table__footer--discount">
                            <p>Discount</p>
                            <input type="text" class="input" v-model="discount">
                        </div>
                        <div class="table__footer--total">
                            <p>Grand Total</p>
                            <span>$ {{ Total() }}</span>
                        </div>
                    </div>
                </div>


            </div>
            <div class="card__header" style="margin-top: 40px;">
                <div>
                    <a class="btn btn-secondary" @click="onSave()">
                        Save
                    </a>
                </div>
            </div>

        </div>
        <!--==================== add modal items ====================-->
        <div class="modal main__modal " :class="{ show: showModal }" @click.self="closeModal()">
            <div class="modal__content">
                <span class="modal__close btn__close--modal" @click="closeModal()">×</span>
                <h3 class="modal__title">Add Item</h3>
                <hr><br>
                <div class="modal__items">
                    <ul style="list-style: none;">
                        <li v-for="(product, i) in listProducts" :key="product.id"
                            style="display: grid;grid-template-columns: 30px 350px 15px; align-items: center; padding-bottom: 5px;">
                            <p style="text-decoration:none; color: red;">{{ i + 1 }}</p>
                            <p>{{ product.item_code }}</p>
                            <button @click="addCart(product)"
                                style="border: 1px solid #e0e0e0;width: 35px;height: 35px;cursor: pointer;">+</button>
                        </li>
                    </ul>

                </div>
                <br>
                <hr>
                <div class="model__footer">
                    <button class="btn btn-light mr-2 btn__close--modal" @click="closeModal()">
                        Cancel
                    </button>
                </div>
            </div>
        </div>

        <br><br><br>
    </div>
</template>

<script>
import { onMounted } from 'vue';
import { ref } from 'vue';
import axios from 'axios';
import apiUrl from '../url/apiUrls.js'
import router from '@/router/index.js';

export default {
    name: 'NewInvoice',
    setup() {
        let customers = ref([])
        let customer_id = ref([])
        let item = ref([])
        let listCart = ref([])
        const showModal = ref(false)
        const hideModal = ref(true)
        let listProducts = ref([])
        let discount = ref(0)
        let date = ref(null)
        let due_date = ref(null)
        let number = ref(null)
        let reference = ref(null)
        let terms = ref(null)

        let emptyField = ref(null)

        onMounted(async () => {
            getAllCustomers()
            getProducts()
        })

        const getAllCustomers = async () => {
            try {
                let response = await axios.get(apiUrl + '/customers');
                customers.value = response.data.data;
                // console.log("allCustomers.value", customers.value)
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        const addCart = (item) => {
            const itemCart = {
                id: item.id,
                item_code: item.item_code,
                description: item.description,
                unit_price: item.unit_price,
                quantity: item.quantity,
            }
            listCart.value.push(itemCart)
            closeModal()
        }

        const removeItem = (index) => {
            listCart.value.splice(index, 1)
        }

        const openModal = () => {
            showModal.value = !showModal.value
        }

        const closeModal = () => {
            showModal.value = !showModal.value
        }

        const getProducts = async () => {
            try {
                let response = await axios.get(apiUrl + '/products');
                listProducts.value = response.data.data;
                // console.log("listProducts.value", listProducts.value)
            }
            catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        const subTotal = () => {
            let total = 0
            listCart.value.forEach((data) => {
                total += data.quantity * data.unit_price;
            });
            return total
        }

        const Total = () => {
            // discount is percentage
            return subTotal() - (subTotal() * discount.value / 100)
        }

        const onSave = () => {
            if (!date.value || !due_date.value || !number.value || !reference.value) {
                emptyField.value = "this fields are required"
            }
            else {
                emptyField.value = null
            }
            if (listCart.value.length >= 1) {
                let subtotal = 0
                subtotal = subTotal()

                let total = 0
                total = Total()

                const formData = new FormData()
                formData.append('invoice_item', JSON.stringify(listCart.value))
                formData.append('customer_id', customer_id.value)
                formData.append('date', date.value)
                formData.append('due_date', due_date.value)
                formData.append('number', number.value)
                formData.append('reference', reference.value)
                formData.append('terms_and_conditions', terms.value)
                formData.append('sub_total', subtotal)
                formData.append('total', total)
                formData.append('discount', discount.value)

                axios.post(apiUrl + '/add_invoice', formData)
                listCart.value = []
                router.push('/')
            }
        }

        return {
            customer_id, customers, addCart, item, listCart, openModal,
            showModal, hideModal, closeModal, getProducts, listProducts, removeItem,
            subTotal, discount, Total, onSave, date, due_date, number, reference, terms, emptyField
        }
    }
}
</script>
