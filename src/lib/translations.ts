import type { Section } from "./routes";

type BodyKey = `${Section}/${string}`;

export const titleCorrections = new Map<string, string>([
  ["KI (UBB Cluj-Napoca)", "Artificial Intelligence (UBB Cluj-Napoca)"],
  ["Neural Processes for Optimal Sensor Placment", "Neural Processes for Optimal Sensor Placement"],
  [
    "Uncertainty-Aware Stenoses Segmentation in Digital Subtraction Angriography using Probabilistic Deep Learning",
    "Uncertainty-Aware Stenosis Segmentation in Digital Subtraction Angiography using Probabilistic Deep Learning",
  ],
  [
    "Methods for Pseudo-Label Selection for Student-Teacher-based Domain Adapation",
    "Methods for Pseudo-Label Selection for Student-Teacher-based Domain Adaptation",
  ],
]);

export const summaryOverrides = new Map<BodyKey, string>([
  [
    "projects/data4sim",
    "Sensor-based capture and simulation of manual logistics processes for testing operational changes before they are implemented.",
  ],
  [
    "projects/ai4pumps",
    "AI-based speed control for pump systems that predicts efficient operating points from sensor and pulsation data.",
  ],
  [
    "projects/show2instruct",
    "Multimodal generative AI for turning natural-language interaction with complex software systems into machine-processable instructions.",
  ],
  [
    "projects/ki-ubb-cluj-napoca",
    "Artificial Intelligence teaching material for the UBB Cluj-Napoca block course.",
  ],
  [
    "projects/egoproject2026",
    "A student group project on spatial understanding in egocentric data, foundation models, and embodied intelligence.",
  ],
  [
    "projects/root",
    "Summer school material for transfer learning and programming tasks in the RoOT context.",
  ],
]);

export const bodyOverrides = new Map<BodyKey, string>([
  [
    "projects/ai4pumps",
    `#### Facts

Duration: 01.07.2024 - 30.06.2026

Funder: Federal Ministry for Economic Affairs and Climate Action (BMWK)

Funding volume: 182,000 EUR for the University of Rostock

Project partner: Hydronauten GmbH

# AI4Pumps

#### Intelligent AI-supported speed control of centrifugal pumps through active pulsation damping

Pumps account for a significant share of industrial electricity consumption, but they are often operated inefficiently. The goal of the project is to develop a novel AI-based speed control system that keeps pump systems closer to their energetic best point.

The project builds on QuietHydro technology developed by Hydronauten GmbH. QuietHydro uses active noise cancellation to prevent the propagation, reflection, and transmission of pressure waves in the system, and makes it possible to distinguish pressure pulsations coming from the pump from those coming from the pipeline system.

The project develops an AI system that predicts the pump's energetic best point from data captured by QuietHydro. A hardware platform for connecting sensors and control components is also being developed. The project aims to increase the energy efficiency of pumps and contribute to the energy transition and climate protection. The results are intended to feed into a market-ready monitoring platform for pump systems.

### Contact

Daniel Wulff

d.wulff@uni-rostock.de`,
  ],
  [
    "projects/data4sim",
    `#### Facts

Duration: 01.10.2023 - 31.03.2026

Funder: Federal Ministry for Economic Affairs and Climate Action (BMWK)

Funding volume: 220,000 EUR for the University of Rostock

Project partners: MotionMiners GmbH, SDZ GmbH, TU Dortmund Chair of Materials Handling and Warehousing

# Data4Sim

#### Data-driven simulation of manual logistics processes

The project develops methods for capturing manual operating processes with body-worn sensors and transferring them, partly automatically, into simulation models. These simulation models make it possible to predict the effects of changes in manual operating processes, for example in manual picking processes in logistics centers or retail distribution warehouses.

Changes in work sequences, such as variations in pick-list generation, or changes in storage strategies, such as item placement in the warehouse, can be evaluated through simulation before they are implemented.

Technically, the project first records manual processes with wearable sensors. Based on this sensor data, AI methods such as convolutional neural networks infer the activities performed by employees. These activities are transferred into a detailed simulation model of the manual processes. The model represents parameters such as task duration, dependencies such as fatigue or experience, and the temporal structure of activities. The resulting simulation model supports targeted planning and evaluation of process optimization measures.

### Publications

Moh'd Khier Al Kfari, Stefan Lüdtke. Domain Adaptation in Human Activity Recognition through Self-Training. Companion of the 2024 on ACM International Joint Conference on Pervasive and Ubiquitous Computing (Ubicomp Workshops) 2024. [[web]](https://doi.org/10.1145/3675094.3678465)

Friedrich Niemann, Fernando Moya Rueda, Moh'd Khier Al Kfari, Nilah Ravi Nair, Stefan Lüdtke and Alice Kirchheim. Towards Standardized Dataset Creation for Human Activity Recognition: Framework, Taxonomy, Checklist, and Best Practices. 9th International Workshop on Annotation of Real World Data for Artificial Intelligent Systems (2025).

### Contact

Moh'd Khier Al Kfari

mohd.kfari@uni-rostock.de`,
  ],
  [
    "projects/show2instruct",
    `#### Facts

Duration: 01.02.2025 - 31.01.2028

Funder: Federal Ministry of Research, Technology and Space (BMFTR)

Funding volume: 664,000 EUR for the University of Rostock

Project partners: Ramblr GmbH, neoBIM GmbH, TU Clausthal

# Show2Instruct

#### Generating machine-processable control commands from natural-language interaction using object references in the visual system context

Major advances in foundation models, especially semantic image analysis and large language models, enable natural-language and context-specific interaction between physical systems and humans. However, the development of AI-based interaction mechanisms that integrate foundation models from computer vision and large language models is still at an early stage.

For example, during a construction-site inspection, context-specific natural-language queries could be evaluated: "Do all windows and doors in this room match the specification in the BIM system, and have all accessibility requirements been met?" This research field is only beginning to emerge, but it will play an important role for future context-aware voice interaction systems.

This project develops a generative AI technology basis for human-machine interfaces. The goal is not only natural-language operation of software and machines through large language models, but also the ability to include visually recognized objects from the local system context in prompts.

### Publications

Nithyanantham, B. K., Sesterhenn, T., Nedungadi, A., Garijo, S. P., Zenkner, J., Bartelt, C., & Lüdtke, S. (2025). MCP4IFC: IFC-Based Building Design Using Large Language Models. *arXiv preprint arXiv:2511.05533*.

### Contact

[Bharathi Kannan Nithyanantham](/people/bharathi/)

bharathikannan.nithyanantham@uni-rostock.de

[Ashwin Nedungadi](/people/ashwin/)

ashwin.nedungadi@uni-rostock.de`,
  ],
  [
    "projects/ki-ubb-cluj-napoca",
    `# Artificial Intelligence

#### UBB Cluj-Napoca, 24.02.25 - 07.03.25

[Schedule](https://www.mds-lab.de/s/planning-49le.pdf)

[Exercises](https://mybinder.org/v2/gh/stefanluedtke/AI-Exercises/HEAD)

[Project task](https://www.mds-lab.de/s/Projekt-7fak.pdf)

[Thesis topics](https://www.mds-lab.de/s/Themen-Cluj.pdf)

### Lectures

[Intro](https://www.mds-lab.de/s/01-intro.pdf)

[Agents](https://www.mds-lab.de/s/02-agents.pdf)

[Search](https://www.mds-lab.de/s/03-probsearch.pdf)

[Constraint Satisfaction Problems](https://www.mds-lab.de/s/04-csps-complete.pdf)

[Games](https://www.mds-lab.de/s/05-game-playing-complete.pdf)

[Probability Theory](https://www.mds-lab.de/s/07-uncertainty.pdf)

[Bayesian Networks](https://www.mds-lab.de/s/08-bayesian-networks-complete.pdf)

[Hidden Markov Models](https://www.mds-lab.de/s/09-hmms-complete.pdf)

[Machine Learning: Clustering, Decision Trees, and Evaluation](https://www.mds-lab.de/s/10-machine-learning-complete.pdf)

[Artificial Neural Networks: Perceptron](https://www.mds-lab.de/s/14-perceptron-complete.pdf)

[Artificial Neural Networks: Feedforward Neural Networks and Backpropagation](https://www.mds-lab.de/s/15-feedforward-networks-complete.pdf)

[Video: Intuition for Backpropagation](https://www.youtube.com/watch?v=Ilg3gGewQ5U)

[Artificial Neural Networks: Generalization](https://www.mds-lab.de/s/11L_Generalisation_Capacity_Optimisation_complete.pdf)

[Markov Decision Processes](https://www.mds-lab.de/s/17-mdps-complete.pdf)

[Reinforcement Learning](https://www.mds-lab.de/s/18-RL.pdf)

[AI Safety](https://www.mds-lab.de/s/14-ai-safety-complete.pdf)`,
  ],
  [
    "people/stefan-ludtke",
    `# Stefan Lüdtke

Assistant Professor (Juniorprofessor)

[E-Mail](mailto:stefan.luedtke@uni-rostock.de)
[Google Scholar](https://scholar.google.de/citations?user=DxgfRiQAAAAJ)
[DBLP](https://dblp.org/pid/173/2291.html)

Albert-Einstein-Str. 21, 18059 Rostock
Room 206

### Research Interests

- Neuro-symbolic machine learning
- Machine learning for heterogeneous data
- Machine learning for marine ecology and underwater technology

### CV

- Since 01/2026: Member of the [CORE Network](https://www.core-network.ai/#/network) (Cognitive Robotics in Europe)
- Since 07/2023: Junior professor for Marine Data Science, University of Rostock
- 2023: Junior research group leader, ScaDS.AI Leipzig
- 2021 - 2023: Postdoc, Institute for Enterprise Systems, University of Mannheim
- 2016 - 2021: PhD student, University of Rostock`,
  ],
]);

export function correctedTitle(title: string): string {
  return titleCorrections.get(title) ?? title;
}

export function overrideKey(collection: Section, slug: string): BodyKey {
  return `${collection}/${slug}`;
}
