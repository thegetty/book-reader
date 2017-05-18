<template>
  <ul>
    <li v-for="item in data">
      <a class="outline_link" @click="handleLink(item)">
        {{ item.title || '' }}
        <outline v-if="item.items.length" :data="item.items" @onClick="handleLink"/>
      </a>
    </li>
  </ul>
</template>

<script>

export default {
  name: 'outline',
  components: {

  },
  props: {
    'data': {
      type: Array
    }
  },
  data () {
    return {};
  },
  methods: {
    handleLink: function (item) {
      console.log(item.dest);
      this.$emit('onClick', item.dest);
    }
  }
}
</script>

<style scoped>

ul {

}

li {

}

li a {
  cursor: pointer;
}

</style>
