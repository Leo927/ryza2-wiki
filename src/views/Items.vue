<template>
    <b-container>
        <h1 class="text-center">物品</h1>
        <b-row>
            <router-link class="btn btn-outline-primary mx-auto" v-if="editMode" to="/item/">创建新物品</router-link>
        </b-row>
        <ItemList></ItemList>
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