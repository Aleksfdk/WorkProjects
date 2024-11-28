import { FC, useMemo } from 'react';
import { Space, Typography } from 'antd';
import { Radar, RadarConfig } from '@ant-design/plots';
import { IItemChart } from 'types/entities';
import styles from './styles.module.scss';
import styleVars from 'common/styles/variables.scss';

interface IRadarChartProps {
  data: IItemChart[];
  reconfig?: RadarConfig;
}
interface IRadarChartItem {
  data: IItemChart;
}

export const RadarChart: FC<IRadarChartProps> = ({ data, reconfig }) => {
  const config = useMemo<RadarConfig>(
    () => ({
      ...{
        data,
        xField: 'key',
        yField: 'value',
        meta: {
          value: {
            alias: 'Оценка',
            min: 0,
            max: 1
          },
          key: {
            formatter: (e: string) => `${e.slice(0, 30)}...`
          }
        },
        lineStyle: {
          lineWidth: 3,
          fill: styleVars.helsinki,
          fillOpacity: 0.1
        },

        tooltip: {
          customContent: (str: string, data: IRadarChartItem[]) => {
            const key = data[0]?.data?.key || 'н/д';
            const value = data[0]?.data?.value || 0;
            const { Paragraph } = Typography;
            return (
              <Space direction={'vertical'} className={styles.tooltip}>
                <Paragraph>{key}</Paragraph>
                <Paragraph>Оценка: {value}</Paragraph>
              </Space>
            );
          }
        },
        xAxis: {
          line: null,
          tickLine: null,
          grid: {
            line: {
              style: {
                lineDash: null
              }
            }
          }
        },
        point: {
          size: 2
        }
      },
      ...reconfig
    }),
    [data, reconfig]
  );
  return (
    <div className={styles.wrapper}>
      <Radar {...config} />
    </div>
  );
};
