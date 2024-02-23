<template>
  <div class="container">
    <div class="invoices">
      <div class="card__header">
        <div>
          <h2 class="invoice__title">Invoices</h2>
        </div>
        <div>
          <router-link class="btn btn-secondary" :to="{ name: 'new-invoice' }">
            New Invoice
          </router-link>
        </div>
      </div>

      <div class="table card__content">
        <div class="table--filter">
          <span class="table--filter--collapseBtn ">
            <i class="fas fa-ellipsis-h"></i>
          </span>
          <div class="table--filter--listWrapper">
            <ul class="table--filter--list">
              <li>
                <p class="table--filter--link table--filter--link--active">
                  All
                </p>
              </li>
              <li>
                <p class="table--filter--link ">
                  Paid
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div class="table--search">
          <div class="table--search--wrapper">
            <select class="table--search--select" name="" id="">
              <option value="">Filter</option>
            </select>
          </div>
          <div class="relative">
            <i class="table--search--input--icon fas fa-search "></i>
            <input class="table--search--input" type="text" placeholder="Search invoice" v-model="searchInvoice"
              @keyup="search()">
          </div>
        </div>

        <div class="table--heading">
          <p>ID</p>
          <p>Date</p>
          <p>Number</p>
          <p>Customer</p>
          <p>Due Date</p>
          <p>Total</p>
        </div>

        <!-- item 1 -->
        <div v-if="invoices.length">
          <div class="table--items" v-for="item in invoices" :key="item.id">
            <a href="#" @click="onShow(item.id)" class="table--items--transactionId">
              #{{ item.id }}
            </a>
            <p>{{ item.date }}</p>
            <p>#{{ item.number }}</p>
            <p v-if="item.customer">{{ item.customer.firstname }}</p>
            <p v-else></p>
            <p>{{ item.due_date }}</p>
            <p>$ {{ item.total }}</p>
          </div>
        </div>
        <div v-else>
          <p>No invoice found</p>
        </div>
      </div>

    </div>

    <br><br><br>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import apiUrl from '../url/apiUrls.js'
import router from '@/router'

export default {
  name: 'HomeView',
  setup() {
    let invoices = ref([])
    let searchInvoice = ref([])

    onMounted(async () => {
      getInvoices()
    })

    const getInvoices = async () => {
      try {
        let response = await axios.get(apiUrl + '/invoices');
        invoices.value = response.data.data;
        // console.log(invoices.value)
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    const search = async () => {
      try {
        let response = await axios.get(apiUrl + '/search_invoices?s=' + searchInvoice.value);
        // console.log(response.data.data)
        invoices.value = response.data.data;
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    const onShow = (id) => {
      router.push('/invoice/show/' + id)
    }

    return {
      invoices, searchInvoice, search, onShow
    }
  },
}
</script>
