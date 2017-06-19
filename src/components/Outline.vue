<template>
  <ul>
    <li v-for="item in pageList">
      <a class="outline_link" :class="{ active: item === activeItem }" @click="handleLink(item)">
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
    },
    'page': {
      type: Number,
      default: undefined
    },
    'pdf': {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      pageList: [],
      activeItem: undefined
    };
  },
  mounted () {
    if (this.data) {
      this.processData();
    }
  },
  methods: {
    processData () {
      this.pageList = [];
      this.data.forEach((item, i) => {
        let li = Object.assign({}, item);
        this.pageList.push(li);
        this.pdf.getPageIndex(item.dest[0]).then((pg) => {
          li.page = pg;

          if (i === this.data.length - 1) {
            this.checkActive();
          }
        });
      });
    },
    handleLink (item) {
      this.$emit('onClick', item.dest);
    },
    checkActive () {
      for (let item of this.pageList) {
        if (item.page > this.page) {
          break;
        } else {
          this.activeItem = item;
        }
      }
    }
  },
  watch: {
    data () {
      this.processData();
    },
    page () {
      this.checkActive();
    }
  }
}
</script>

<style scoped>

ul {
  border-top: 1px solid #ccc;
  padding: 40px;
}

li {
  margin: 12px;
}

li a {
  cursor: pointer;
  color: #eee;
}

li a:active, li a.active {
  color: #fff;
  text-decoration: underline;
}

</style>
