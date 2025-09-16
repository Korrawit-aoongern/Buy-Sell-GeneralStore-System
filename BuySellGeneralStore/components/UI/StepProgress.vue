<template>
  <div class="steps">
    <div
      class="step"
      :class="{ active: currentStep >= 1 }"
    >
      <div class="circle">1</div>
      <div class="label">Order</div>
    </div>

    <div :class="['line', { active: currentStep > 1 }]"></div>

    <div
      class="step"
      :class="{ active: currentStep >= 2 }"
    >
      <div class="circle">2</div>
      <div class="label">Details</div>
    </div>

    <div :class="['line', { active: currentStep > 2 }]"></div>

    <div
      class="step"
      :class="{ active: currentStep >= 3 }"
    >
      <div class="circle">3</div>
      <div class="label">Submit</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepProgress',
  props: {
    currentStep: {
      type: Number,
      required: true,
      validator(value) {
        return value >= 1 && value <= 3;
      }
    }
  }
};
</script>

<style scoped>
.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: prompt, 'san-serif';
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #222;
}

.circle {
  width: 40px;
  height: 40px;
  border: 2px solid #55c198;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #55c198;
  background-color: transparent;
  font-weight: bold;
  font-size: 30px;
  transition: all 0.3s ease;
}

.step.active .circle {
  background-color: #55c198;
  color: white;
}

.label {
  margin-top: 6px;
  font-weight: bold;
}

.line {
  width: 60px;
  height: 2px;
  background-color: #55c198;
  transition: background-color 0.3s ease;
  margin-bottom: 25px;
}

.line.active {
  background-color: #55c198;
}
</style>
