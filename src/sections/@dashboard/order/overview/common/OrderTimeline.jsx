import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fDateTimeSuffix } from '../../../../../utils/formatTime';

// ----------------------------------------------------------------------
const INFO_ORDER = loader('../../../../../graphql/queries/orderProcess/listInformationOrder.graphql');
// ----------------------------------------------------------------------

export default function OrderTimeline() {
  const [timeLineOrderLst, setTimeLineOrderLst] = useState([]);
  const { id } = useParams();
  const { data } = useQuery(INFO_ORDER, {
    variables: {
      orderId: Number(id),
    },
  });

  useEffect(() => {
    if (data) setTimeLineOrderLst(data.listInformationOrder);
  }, [data]);

  return (
    <Card
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none',
        },
      }}
    >
      <CardHeader title="Thông tin quy trình đơn hàng" />
      <CardContent>
        <Timeline>
          {timeLineOrderLst.map((item, index) => (
            <OrderTimelineItem key={item.id} item={item} isLast={index === 5} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

OrderTimelineItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool,
};

function OrderTimelineItem({ item, isLast }) {
  const { description, createdAt, toStatus } = item;

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (toStatus === 'Tạo mới' && 'primary') ||
            (toStatus === 'Đang giao hàng' && 'warning') ||
            (toStatus === 'Giao hàng thành công' && 'success') ||
            (toStatus === 'Đang thanh toán' && 'info') ||
            (toStatus === 'Xác nhận thanh toán và hồ sơ' && 'info') ||
            'success'
          }
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{description}</Typography>
        <Typography variant="subtitle2">{toStatus}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTimeSuffix(createdAt)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
