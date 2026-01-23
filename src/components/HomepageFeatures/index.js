import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '設計複雜的機器人',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        學習使用 VEX V5 構建系統設計和組裝複雜的機制。
        掌握齒輪、馬達和結構完整性。
      </>
    ),
  },
  {
    title: '使用信心編碼',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        利用 VEXcode 或 PROS 解鎖機器人的完整潛力。
        為自動化和驅動控制編寫高效的算法。
      </>
    ),
  },
  {
    title: '競賽和合作',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        加入全球 VEX 機器人競賽社區。
        分享策略、學習他人的方法，並追求冠軍。
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
