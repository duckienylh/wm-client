// noinspection JSValidateTypes,DuplicatedCode

import { Document, Page, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import { formatPhoneNumber, fVietNamCurrency } from '../../../../utils/formatNumber';
import styles from './InvoiceStyle';
import { fDateToDay, fDateToMonth, fDateToYear } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

InvoicePDF.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default function InvoicePDF({ invoice }) {
  const { orderItemList } = invoice;
  const totalPrice = orderItemList
    ? orderItemList.reduce(
        (total, data) =>
          data?.unitPrice && data?.quantity && Number(data?.unitPrice) > 0 && Number(data?.quantity) > 0
            ? total + Number(data?.unitPrice) * Number(data?.quantity)
            : total + 0,
        0
      )
    : 0;
  // totalPrice = freightPrice ? totalPrice + freightPrice : totalPrice;

  console.log('invoice', invoice);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* <View style={[styles.header]}> */}
        {/*  <Image source="/static/header-quotation.png" style={{ height: 'auto', marginTop: -20 }} /> */}
        {/* </View> */}

        <View style={[styles.headlineContainer, styles.pt140]}>
          <Text style={[styles.h2]}>BÁO GIÁ</Text>
        </View>

        <View style={[styles.gridContainer, styles.mb4]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb6]}>Trân trọng báo cho: Mr/Ms.{invoice.customer.name}</Text>
            <Text style={[styles.overline, styles.mb6]}>Đơn vị: {invoice.customer.companyName}</Text>
            <Text style={[styles.overline, styles.mb6]}>Địa chỉ: {invoice.customer.address}</Text>
          </View>

          <View style={styles.col6FlexEnd}>
            <Text style={[styles.overline, styles.mb6]}>Điện thoại: {invoice.customer.phoneNumber}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb4]}>
          <Text style={styles.body2}>
            Công ty chúng tôi trân trọng gửi tới quý khách Mr/Ms.{invoice.customer.name} báo giá các sản phẩm gỗ và các
            sản phẩm ngành gỗ như sau
          </Text>
        </View>

        <View style={styles.tableWithBorder}>
          <View style={styles.tableHeader}>
            <View style={[styles.tableRow, styles.tableHeaderRow]}>
              <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                <Text style={styles.subtitle2}>Stt</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell2WithBorder]}>
                <Text style={styles.subtitle2}>Sản phẩm</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                <Text style={styles.subtitle2}>Mã sản phẩm</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                <Text style={styles.subtitle2}>Số lượng (Tấn)</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell7WithBorder]}>
                <Text style={styles.subtitle2}>Đơn giá</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell8WithBorder]}>
                <Text style={styles.subtitle2}>Thành tiền</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell9WithBorder, styles.lastCellWithBorderBase]}>
                <Text style={styles.subtitle2}>Ghi chú</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            {orderItemList?.map((odi, index) => (
              <View key={index} style={[styles.tableRow, styles.tableBodyRow]}>
                <View style={[styles.tableCellWithBorderBase, styles.bodyCell1WithBorder]}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.bodyCell2WithBorder]}>
                  <Text>{odi.product.name}</Text>
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.bodyCell4WithBorder]}>
                  <Text>{odi.product.code}</Text>
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.bodyCell6WithBorder]}>
                  <Text>{fVietNamCurrency(odi.quantity)}</Text>
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.bodyCell7WithBorder]}>
                  <Text>{fVietNamCurrency(odi.unitPrice)}</Text>
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.bodyCell8WithBorder]}>
                  <Text>{fVietNamCurrency(Number(odi.quantity) * Number(odi.product.price))}</Text>
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.lastCellWithBorderBase]}>
                  <Text>{odi.note}</Text>
                </View>
              </View>
            ))}

            <View style={[styles.tableRow, styles.tableBodyRow]}>
              <View style={[styles.tableCellWithBorderBase, styles.bodyCell1WithBorder]}>
                <Text style={styles.borderBody2}>I</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.bodyCell2WithBorder]}>
                <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>Cộng</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell4WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell6WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell7WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell8WithBorder]}>
                <Text>{fVietNamCurrency(totalPrice)}</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.lastCellWithBorderBase]}>
                <Text />
              </View>
            </View>

            <View style={[styles.tableRow, styles.tableBodyRow]}>
              <View style={[styles.tableCellWithBorderBase, styles.bodyCell1WithBorder]}>
                <Text style={styles.borderBody2}>II</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.bodyCell2WithBorder]}>
                <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>Thuế VAT (10%)</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell4WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell6WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell7WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell8WithBorder]}>
                <Text>{fVietNamCurrency(totalPrice * 0.1)}</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.lastCellWithBorderBase]}>
                <Text />
              </View>
            </View>

            <View style={[styles.tableRow, styles.tableBodyRow]}>
              <View style={[styles.tableCellWithBorderBase, styles.bodyCell1WithBorder]}>
                <Text style={styles.borderBody2}>III</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.bodyCell2WithBorder]}>
                <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>Tiền vận chuyển</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell4WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell6WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell7WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell8WithBorder]}>
                <Text>{fVietNamCurrency(invoice.freightPrice)}</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.lastCellWithBorderBase]}>
                <Text />
              </View>
            </View>

            <View style={[styles.tableRow, styles.tableBodyRow]}>
              <View style={[styles.tableCellWithBorderBase, styles.bodyCell1WithBorder]}>
                <Text style={styles.borderBody2}>IV</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.bodyCell2WithBorder]}>
                <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>Tổng đơn hàng</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell4WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell6WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell7WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell8WithBorder]}>
                <Text style={styles.borderBody2}>{fVietNamCurrency(invoice.totalMoney)}</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.lastCellWithBorderBase]}>
                <Text />
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb4]}>
          <View style={[styles.col65, { paddingTop: 5 }]}>
            <Text style={[styles.h3, styles.mb6]}>Báo giá trên:</Text>
            <Text style={[styles.overline, styles.fontWeight400, styles.mb4]}>- Đã bao gồm 10% thuế VAT</Text>
            <Text style={[styles.overline, styles.fontWeight400, styles.mb4]}>- Báo giá có hiệu lực 3 ngày</Text>
            <Text style={[styles.overline, styles.fontWeight400, styles.mb4]}>- Thời gian thực hiện: 1-2 ngày</Text>
            <Text style={[styles.overline, styles.fontWeight400, styles.mb4]}>
              - Thanh toán 100% đơn hàng ngay khi đặt hàng
            </Text>
          </View>

          <View style={[styles.col35FlexEnd, { paddingTop: 10 }]}>
            <Text style={[styles.overline, styles.fontWeight400, styles.mb4]}>
              Hà Nội, ngày {fDateToDay(invoice.updatedAt)} tháng {fDateToMonth(invoice.updatedAt)} năm{' '}
              {fDateToYear(invoice.updatedAt)}
            </Text>
            <Text
              style={[
                styles.overline,
                styles.mb40,
                { textAlign: 'center', alignSelf: 'center', alignItems: 'center', paddingTop: 10 },
              ]}
            >
              NGƯỜI BÁO GIÁ
            </Text>
            <Text
              style={[
                styles.overline,
                styles.mb4,
                styles.fontWeight400,
                { textAlign: 'center', alignSelf: 'center', alignItems: 'center', paddingTop: 10 },
              ]}
            >
              {invoice.sale.fullName} - {formatPhoneNumber(invoice.sale.phoneNumber)}
            </Text>
          </View>
        </View>

        {/* <View style={[styles.footer]}> */}
        {/*  <Image source="/static/footer-quotation.png" style={{ zIndex: 8989 }} /> */}
        {/* </View> */}
      </Page>
    </Document>
  );
}
