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
  components: {},
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
          this.$emit('current', this.activeItem.title);
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
  padding: 0 20px 20px 52px;
}

li {
  margin: 0 0 8px 0;
}

li a {
  cursor: pointer;
  color: #4c4c4c;
}

li a:active, li a.active {
  color: #000;
  text-decoration: underline;
}

</style>
