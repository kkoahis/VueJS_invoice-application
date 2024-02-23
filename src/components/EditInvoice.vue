<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue';
import axios from 'axios'
import apiUrl from '../url/apiUrls.js'
import { defineProps } from 'vue'
import router from '@/router/index.js';

let form = ref({})
let customers = ref([])
const showModal = ref(false)
let listProducts = ref([])


const props = defineProps({
    id: {
        type: String,
        default: ''
    }
})

onMounted(() => {
    getInvoice()
    getCustomer()
    getProducts()
    // console.log(props.id)
})

const getInvoice = async () => {
    try {
        const response = await axios.get(apiUrl + '/show_invoice/' + props.id)
        form.value = response.data.data
        // console.log("invoice", form.value)
    } catch (error) {
        console.error(error)
    }
}

const getCustomer = async () => {
    try {
        const response = await axios.get(apiUrl + '/customers')
        customers.value = response.data.data
    } catch (error) {
        console.error(error)
    }
}

const removeInvoiceItem = (index) => {
    form.value.invoice_items.splice(index, 1)
}

const addCart = (item) => {
    const itemCart = {
        product_id: item.id,
        item_code: item.item_code,
        description: item.description,
        unit_price: item.unit_price,
        quantity: item.quantity,
    }
    form.value.invoice_items.push(itemCart)
    closeModal()
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

const openModal = () => {
    showModal.value = !showModal.value
}

const closeModal = () => {
    showModal.value = !showModal.value
}

const subTotal = () => {
    let total = 0
    if (form.value.invoice_items) {
        form.value.invoice_items.map((data) => {
            total += data.unit_price * data.quantity
        })
    }
    return total
}

const Total = () => {
    // discount is percentage
    if (form.value.discount == undefined || form.value.discount == null || form.value.discount == "") {
        form.value.discount = 0
    }
    else if (form.value.discount > 100) {
        form.value.discount = 100
    }
    else if (form.value.discount < 0) {
        form.value.discount = 0
    }
    else if (form.value.invoice_items) {
        return subTotal() - (subTotal() * form.value.discount / 100)
    }
    return subTotal()
}

const onEdit = () => {
    if (form.value.invoice_items.length) {
        let subtotal = 0
        subtotal = subTotal()
        let total = 0
        total = Total()

        axios.put(apiUrl + `/update_invoice/${form.value.id}`, {
            number: form.value.number,
            invoice_items: JSON.stringify(form.value.invoice_items),
            customer_id: form.value.customer_id,
            date: form.value.date,
            due_date: form.value.due_date,
            reference: form.value.reference,
            terms_and_conditions: form.value.terms_and_conditions,
            discount: form.value.discount,
            sub_total: subtotal,
            total: total
        })
            .then(response => {
                console.log(response)
                router.push('/')
            })
            .catch(error => {
                console.error(error)
            })
    }
}


</script>

<template>
    <div class="container">
        <div class="invoices">
            <div class="card__header">
                <div>
                    <h2 class="invoice__title">Edit Invoice</h2>
                </div>
                <div>

                </div>
            </div>

            <div class="card__content">
                <div class="card__content--header">
                    <div>
                        <p class="my-1">Customer</p>
                        <select class="input" v-model="form.customer_id">
                            <option value="" disabled>Select customer</option>
                            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                                {{ customer.firstname }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <p class="my-1">Date</p>
                        <input id="date" placeholder="dd-mm-yyyy" type="date" class="input" v-model="form.date">
                        <p class="my-1">Due Date</p>
                        <input id="due_date" type="date" class="input" v-model="form.due_date">
                    </div>
                    <div>
                        <p class="my-1">Numero</p>
                        <input type="text" class="input" v-model="form.number">
                        <p class="my-1">Reference(Optional)</p>
                        <input type="text" class="input" v-model="form.reference">
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
                    <div class="table--items2" v-for="(item, i) in form.invoice_items" :key="item.id">
                        <p v-if="item.product">#{{ item.product.item_code }} ___ {{ item.product.description }}</p>
                        <p v-else>
                            #{{ item.item_code }} ___ {{ item.description }}
                        </p>
                        <p>
                            <input type="text" class="input" v-model="item.unit_price" disabled>
                        </p>
                        <p>
                            <input type="text" class="input" v-model="item.quantity">
                        </p>
                        <p>
                            $ {{ item.unit_price * item.quantity }}
                        </p>
                        <p style="color: red; font-size: 24px;cursor: pointer;" @click="removeInvoiceItem(i)">
                            &times;
                        </p>
                    </div>
                    <div style="padding: 10px 30px !important;">
                        <button class="btn btn-sm btn__open--modal" @click="openModal()">Add New Line</button>
                    </div>
                </div>

                <div class="table__footer">
                    <div class="document-footer">
                        <p>Terms and Conditions</p>
                        <textarea cols="50" rows="7" class="textarea" v-model="form.terms_and_conditions"></textarea>
                    </div>
                    <div>
                        <div class="table__footer--subtotal">
                            <p>Sub Total</p>
                            <span>
                                $ {{ subTotal() }}
                            </span>
                        </div>
                        <div class="table__footer--discount">
                            <p>Discount (%)</p>
                            <input type="text" class="input" v-model="form.discount">
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

                </div>
                <div>
                    <a class="btn btn-secondary" @click="onEdit()">
                        Save
                    </a>
                </div>
            </div>

        </div>
        <!--==================== add modal items ====================-->
        <div class="modal main__modal" :class="{ show: showModal }" @click.self="closeModal()">
            <div class="modal__content">
                <span class="modal__close btn__close--modal" @click="closeModal()">×</span>
                <h3 class="modal__title">Add Item</h3>
                <hr><br>
                <div class="modal__items">
                    <ul style="list-style: none;">
                        <li v-for="(product, i) in listProducts" :key="product.id"
                            style="display: grid;grid-template-columns: 30px 350px 15px; align-items: center; padding-bottom: 5px;">
                            <p style="text-decoration:none; color: red;">{{ i + 1 }}</p>
                            <p>#{{ product.item_code }} - {{ product.description }}</p>
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