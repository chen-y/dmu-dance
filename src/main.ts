// @ts-ignore
// @ts-nocheck
import {
  DMDance,
  Quantities,
  DMode,
  RLMode,
  LRMode,
  BTMode,
  TBMode,
  L45DMode,
  WaveMode,
  CollisionMode,
} from './d-mu';

import './style.css';

// ts-nocheck
const modes = [
  {
    value: '左右',
    Mode: RLMode,
  },
  {
    value: '右左',
    Mode: LRMode,
  },
  {
    value: '上下',
    Mode: BTMode,
  },
  {
    value: '下上',
    Mode: TBMode,
  },
  {
    value: '波浪',
    Mode: WaveMode,
  },
  {
    value: '45deg',
    Mode: L45DMode,
  },
  {
    value: '对立',
    Mode: CollisionMode,
  },
];

const vm = new Vue({
  el: '#app',
  data() {
    return {
      modes,
      mode: 0,

      dmInstance: null,
      prefix: '',
      suffix: '',
    };
  },
  methods: {
    onModeChange(evt) {
      const mode = modes[Number(evt.target.value)];
      const dMode = new mode.Mode({
        parent: this.dmInstance,
      });
      this.dmInstance.modes.forEach((m) => {
        m.destroy();
      });
      this.dmInstance.setMode(dMode);
    },
    onInput(evt) {
      const v = evt.target.value.trim();

      if (v) {
        this.dmInstance.pool.splice(this.dmInstance.currentIndex, 0, v);
      }

      evt.stopPropagation();
      evt.preventDefault();
      evt.target.value = '';
    },
  },
  mounted() {
    const testTexts: string[] = [];
    for (let i = 0; i < 1000; i++) {
      testTexts.push(`这是第${i + 1}条弹幕`);
    }
    this.dmInstance = new DMDance({
      el: document.getElementById('container')!,
      setting: { quantity: Quantities.High, nodeGap: [20, 50] },
      onNodeCreate: (node) => {
        if (this.prefix) {
          const prefix = document.createElement('span');
          prefix.textContent = this.prefix;
          node.addPrefixContent(prefix);
        }
        if (this.suffix) {
          const suffix = document.createElement('span');
          suffix.textContent = this.suffix;
          node.addSuffixContent(suffix);
        }
        if (Math.random() > 0.5) {
          node.dom.classList.add('add-border');
        } else {
          node.dom.classList.add('add-bg');
        }
      },
    });
    this.dmInstance.pool = testTexts;

    this.dmInstance.start();
  },
});
