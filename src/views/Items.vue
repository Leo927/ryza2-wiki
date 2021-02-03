<template>
    <b-container>
        <h1 class="text-center">物品</h1>
        <b-row>
            <router-link class="btn btn-outline-primary mx-auto col-md-6" v-if="editMode" to="/item/">创建新物品</router-link>
        </b-row>
        <b-row>
        <ItemList></ItemList>
        </b-row>
    </b-container>
</template>

<script>
import ItemList from '@/components/ItemList';
import { mapState } from 'vuex';

export default {
    components:{
        ItemList
    },
    computed:{
        ...mapState([
            'editMode'
        ])
    }
}
</script>