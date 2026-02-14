import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '機械構造與賽季實戰',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        深入解析 VEX V5 構建系統。從 2025-2026 Push Back 賽季策略出發，掌握坦克底盤、
        平行軌道（Parallel Rail）與高效採集機構的組裝精要。
      </>
    ),
  },
  {
    title: '進階編程與自動導航',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        解鎖機械人的完整潛力。學習 PID 控制、里程計（Odometry）與 Pure Pursuit 
        路徑追蹤演算法，讓你的機械人在自動時段無往不利。
      </>
    ),
  },
  {
    title: '資源共享與競賽社區',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        專為 VEX 競賽選手打造。提供 PID 模擬器、齒輪比計算參考與實戰代碼範例，
        助你在 VEX 機器人競賽中脫穎而出。
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
