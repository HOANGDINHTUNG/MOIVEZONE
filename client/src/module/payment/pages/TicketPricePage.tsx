// import React from "react";

// const TicketPricePage: React.FC = () => {
//   return (
//     <div className="container">
//       <h2>Giá vé</h2>
//       <p className="subtitle">(Áp dụng từ ngày 01/06/2023)</p>

//       <h3>1. GIÁ VÉ XEM PHIM 2D</h3>
//       <table>
//         <thead>
//           <tr>
//             <th></th>
//             <th colSpan={3}>
//               Từ thứ 2 đến thứ 5
//               <br />
//               From Monday to Thursday
//             </th>
//             <th colSpan={3}>
//               Thứ 6, 7, CN và ngày Lễ
//               <br />
//               Friday, Saturday, Sunday &amp; public holiday
//             </th>
//           </tr>
//           <tr>
//             <th>Thời gian</th>
//             <th>
//               Ghế thường
//               <br />
//               Standard
//             </th>
//             <th className="th-vip">
//               Ghế VIP
//               <br />
//               VIP
//             </th>
//             <th className="th-sweetbox">
//               Ghế đôi
//               <br />
//               Sweetbox
//             </th>
//             <th>
//               Ghế thường
//               <br />
//               Standard
//             </th>
//             <th className="th-vip">
//               Ghế VIP
//               <br />
//               VIP
//             </th>
//             <th className="th-sweetbox">
//               Ghế đôi
//               <br />
//               Sweetbox
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>
//               Trước 12h
//               <br />
//               Before 12PM
//             </td>
//             <td>55.000đ</td>
//             <td className="th-vip">65.000đ</td>
//             <td className="th-sweetbox">140.000đ</td>
//             <td>70.000đ</td>
//             <td className="th-vip">80.000đ</td>
//             <td className="th-sweetbox">170.000đ</td>
//           </tr>
//           <tr>
//             <td>
//               Từ 12:00 đến trước 17:00
//               <br />
//               From 12PM to before 5PM
//             </td>
//             <td>70.000đ</td>
//             <td className="th-vip">75.000đ</td>
//             <td className="th-sweetbox">160.000đ</td>
//             <td>80.000đ</td>
//             <td className="th-vip">85.000đ</td>
//             <td className="th-sweetbox">180.000đ</td>
//           </tr>
//           <tr>
//             <td>
//               Từ 17:00 đến trước 23:00
//               <br />
//               From 5PM to before 11:00PM
//             </td>
//             <td>80.000đ</td>
//             <td className="th-vip">85.000đ</td>
//             <td className="th-sweetbox">180.000đ</td>
//             <td>90.000đ</td>
//             <td className="th-vip">95.000đ</td>
//             <td className="th-sweetbox">200.000đ</td>
//           </tr>
//           <tr>
//             <td>
//               Từ 23:00
//               <br />
//               From 11:00PM
//             </td>
//             <td>65.000đ</td>
//             <td className="th-vip">70.000đ</td>
//             <td className="th-sweetbox">150.000đ</td>
//             <td>75.000đ</td>
//             <td className="th-vip">80.000đ</td>
//             <td className="th-sweetbox">170.000đ</td>
//           </tr>
//         </tbody>
//       </table>

//       <p className="note">
//         * Đối với phim có thời lượng từ 150 phút trở lên; phụ thu 10.000 VNĐ /
//         vé.
//       </p>

//       <h3>2. GIÁ VÉ XEM PHIM 3D</h3>
//       <table>
//         <thead>
//           <tr>
//             <th></th>
//             <th colSpan={3}>
//               Từ thứ 2 đến thứ 5
//               <br />
//               From Monday to Thursday
//             </th>
//             <th colSpan={3}>
//               Thứ 6, 7, CN và ngày Lễ
//               <br />
//               Friday, Saturday, Sunday &amp; public holiday
//             </th>
//           </tr>
//           <tr>
//             <th>Thời gian</th>
//             <th>
//               Ghế thường
//               <br />
//               Standard
//             </th>
//             <th className="th-vip">
//               Ghế VIP
//               <br />
//               VIP
//             </th>
//             <th className="th-sweetbox">
//               Ghế đôi
//               <br />
//               Sweetbox
//             </th>
//             <th>
//               Ghế thường
//               <br />
//               Standard
//             </th>
//             <th className="th-vip">
//               Ghế VIP
//               <br />
//               VIP
//             </th>
//             <th className="th-sweetbox">
//               Ghế đôi
//               <br />
//               Sweetbox
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>
//               Trước 12h
//               <br />
//               Before 12PM
//             </td>
//             <td>60.000đ</td>
//             <td className="th-vip">80.000đ</td>
//             <td className="th-sweetbox">160.000đ</td>
//             <td>80.000đ</td>
//             <td className="th-vip">100.000đ</td>
//             <td className="th-sweetbox">200.000đ</td>
//           </tr>
//           <tr>
//             <td>
//               Từ 12:00 đến trước 17:00
//               <br />
//               From 12PM to before 5PM
//             </td>
//             <td>80.000đ</td>
//             <td className="th-vip">90.000đ</td>
//             <td className="th-sweetbox">180.000đ</td>
//             <td>100.000đ</td>
//             <td className="th-vip">110.000đ</td>
//             <td className="th-sweetbox">220.000đ</td>
//           </tr>
//           <tr>
//             <td>
//               Từ 17:00 đến trước 23:00
//               <br />
//               From 5PM to before 11:00PM
//             </td>
//             <td>100.000đ</td>
//             <td className="th-vip">110.000đ</td>
//             <td className="th-sweetbox">220.000đ</td>
//             <td>130.000đ</td>
//             <td className="th-vip">140.000đ</td>
//             <td className="th-sweetbox">280.000đ</td>
//           </tr>
//           <tr>
//             <td>
//               Từ 23:00
//               <br />
//               From 11:00PM
//             </td>
//             <td>100.000đ</td>
//             <td className="th-vip">110.000đ</td>
//             <td className="th-sweetbox">220.000đ</td>
//             <td>130.000đ</td>
//             <td className="th-vip">130.000đ</td>
//             <td className="th-sweetbox">260.000đ</td>
//           </tr>
//         </tbody>
//       </table>

//       <p className="note">
//         * Đối với phim có thời lượng từ 150 phút trở lên; phụ thu 10.000 VNĐ /
//         vé.
//       </p>

//       {/* Khối ticket-note tiếng Việt */}
//       <div className="ticket-note" style={{ marginTop: 50, display: "block" }}>
//         <p>
//           <b>
//             * Giá vé đối với các đối tượng khán giả ưu tiên (khi trực tiếp sử
//             dụng dịch vụ xem phim tại rạp chiếu phim):
//           </b>
//         </p>
//         <ul style={{ marginTop: 18 }}>
//           <li>
//             Giảm 20% giá vé theo qui định đối với: Trẻ em (người dưới 16 tuổi),
//             người cao tuổi (công dân Việt Nam từ đủ 60 tuổi trở lên), người có
//             công với cách mạng, người có hoàn cảnh đặc biệt khó khăn.
//           </li>
//           <li>Giảm 50% giá vé theo qui định đối với: Người khuyết tật nặng.</li>
//           <li>
//             Giảm giá vé 100% đối với: Người khuyết tật đặc biệt nặng, trẻ em
//             dưới 0.7m đi kèm với người lớn.
//           </li>
//         </ul>
//         <b
//           style={{
//             fontStyle: "italic",
//             marginTop: 25,
//             display: "block",
//           }}
//         >
//           Điều kiện:
//         </b>
//         <ul>
//           <li>
//             Chỉ áp dụng khi mua vé tại quầy (không áp dụng khi mua online).
//           </li>
//           <li>
//             Các đối tượng khán giả trên phải xuất trình giấy tờ chứng minh khi
//             mua vé xem phim và trước khi vào phòng chiếu. Cụ thể:
//             <ul style={{ listStyleType: "'- '" }}>
//               <li>
//                 Trẻ em (trường hợp trẻ em từ 14-16 tuổi), người cao tuổi: xuất
//                 trình "Căn cước công dân".
//               </li>
//               <li>Người có công với cách mạng: xuất trình giấy xác nhận.</li>
//               <li>
//                 Người có hoàn cảnh đặc biệt khó khăn: xuất trình "Giấy chứng
//                 nhận hộ nghèo".
//               </li>
//               <li>Người khuyết tật: xuất trình "Giấy xác nhận khuyết tật".</li>
//             </ul>
//           </li>
//         </ul>
//         <p>
//           <b>
//             * Ưu đãi cho học sinh, sinh viên từ 22 tuổi trở xuống: Đồng giá
//             55.000đ /vé 2D cho tất cả các suất chiếu phim từ Thứ 2 đến Thứ 6
//             (chỉ áp dụng cho hình thức mua vé trực tiếp tại quầy, không áp dụng
//             với ghế đôi; Mỗi thẻ được mua 1 vé/ngày và vui lòng xuất trình thẻ
//             U22 kèm thẻ HSSV khi mua vé)
//           </b>
//         </p>
//         <p>
//           <b>
//             * Khán giả nghiêm túc thực hiện xem phim đúng độ tuổi theo phân loại
//             phim: P, K, T13, T16, T18, C. (Trường hợp vi phạm sẽ xử phạt theo
//             Quy định tại Nghị định 128/2022/NĐ-CP ngày 30/12/2022).
//           </b>
//         </p>
//         <p>
//           <b>
//             * Không bán vé cho trẻ em dưới 13 tuổi đối với các suất chiếu phim
//             kết thúc sau 22h00 và không bán vé cho trẻ em dưới 16 tuổi đối với
//             các suất chiếu phim kết thúc sau 23h00.
//           </b>
//         </p>
//         <p>
//           <b>* Áp dụng giá vé ngày Lễ, Tết cho các ngày:</b>
//         </p>
//         <ul>
//           <li>
//             Các ngày nghỉ Lễ, Tết theo quy định của nhà nước: Tết Nguyên Đán,
//             Tết Dương Lịch, ngày Giỗ Tổ Hùng Vương 10/3 AL, ngày 30/4, 1/5, 2/9.
//           </li>
//           <li>Các ngày: 14/2, 8/3, 24/12.</li>
//           <li>Các ngày: Nghỉ bù do nghỉ Lễ, Tết trùng vào thứ 7, Chủ Nhật.</li>
//         </ul>
//         <p>
//           <b>
//             * Không áp dụng các chế độ ưu đãi, các chương trình khuyến mại khác
//             vào các ngày 20/10, 20/11, Halloween 31/10, các ngày Lễ, Tết, suất
//             chiếu sớm và suất chiếu đặc biệt.
//           </b>
//         </p>
//         <p
//           style={{
//             display: "block",
//             marginTop: 15,
//           }}
//         >
//           ĐỀ NGHỊ QUÝ KHÁN GIẢ LƯU Ý KHI MUA VÉ XEM PHIM (ĐẶC BIỆT KHI MUA VÉ
//           ONLINE). TTCPQG KHÔNG CHẤP NHẬN HOÀN TIỀN HOẶC ĐỔI VÉ ĐÃ THANH TOÁN
//           THÀNH CÔNG KHI MUA VÉ ONLINE VÀ VÉ MUA SAI QUY ĐỊNH TẠI QUẦY VÉ.
//         </p>
//         <p
//           style={{
//             display: "block",
//             marginTop: 15,
//           }}
//         >
//           Rất mong Quý khán giả phối hợp thực hiện.
//           <br />
//           Xin trân trọng cảm ơn!
//         </p>
//       </div>

//       {/* Khối ticket-note tiếng Anh */}
//       <div className="ticket-note" style={{ marginTop: -20 }}>
//         <p>
//           <b>
//             * Ticket pricing policy for priority audiences watching movies at
//             the cinema:
//           </b>
//         </p>
//         <ul>
//           <li>
//             Discount 20% on ticket price for: Children and teenagers (under 16
//             years old), elderly people (Vietnamese citizens aged from 60 years
//             old), revolutionary contributors, people with difficult living
//             conditions.
//           </li>
//           <li>
//             Discount 50% on ticket price as regulations for: People with severe
//             disabilities.
//           </li>
//           <li>
//             Discount 100% on ticket price for: People with particularly severe
//             disabilities; Children under 0.7m accompanied by adults.
//           </li>
//         </ul>
//         <b style={{ fontStyle: "italic" }}>Condition:</b>
//         <ul>
//           <li>
//             Only applicable when buying tickets at the counter (not for online
//             tickets).
//           </li>
//           <li>
//             The above-mentioned audiences must present Identification Documents
//             when buying movie tickets and before entering the screening room.
//             Particularly:
//             <ul style={{ listStyleType: "'- '" }}>
//               <li>
//                 Teenagers (14-16 years old), elderly people: must present "ID
//                 card".
//               </li>
//               <li>
//                 Revolutionary contributors: must present a certificate as
//                 prescribed.
//               </li>
//               <li>
//                 People with difficult living conditions: must present
//                 "Certificate of Poor Household".
//               </li>
//               <li>
//                 People with disabilities: must present "Certificate of
//                 Disability".
//               </li>
//             </ul>
//           </li>
//         </ul>
//         <p>
//           <b>
//             * Special promotion for student who is 22 years old and under: From
//             Monday to Friday 55.000đ/2D ticket for all slot times (only apply
//             for direct purchase at the ticket stall, one student card can buy
//             one ticket/day, student should show their U22 and student cards to
//             get this priority).
//           </b>
//         </p>
//         <p>
//           <b>
//             * Strict implementation of audience classification according to
//             their ages: P, K, T13, T16, T18, C. (Violation will be sanctioned
//             according to the provisions of Decree 128/2022/ND-CP dated on
//             December 30, 2022).
//           </b>
//         </p>
//         <p>
//           <b>
//             * Tickets for movies ending after 22:00 are not sold to teenagers
//             under 13 years old and tickets for movies ending after 23:00 are not
//             sold to teenagers under 16 years old.
//           </b>
//         </p>
//         <p
//           style={{
//             display: "block",
//             marginTop: 35,
//           }}
//         >
//           <b>* Holiday price is applied on:</b>
//         </p>
//         <ul>
//           <li>
//             The public holidays as prescribed by state: New year, Lunar new
//             year, Hung King&apos;s festival (March 10th - lunar calendar), April
//             30th, May 1st, September 2nd.
//           </li>
//           <li>Days: Valentine, Women&apos;s Day, Noel.</li>
//           <li>
//             Compensatory days off due to holidays coinciding with Saturday and
//             Sunday.
//           </li>
//         </ul>
//         <p
//           style={{
//             display: "block",
//             marginTop: 28,
//           }}
//         >
//           <b>
//             * Do not apply preferential programs and different promotional ones
//             in the day 20/10, 20/11, Halloween 31/10, holidays, sneak show and
//             special show.
//           </b>
//         </p>
//         <p
//           style={{
//             display: "block",
//             marginTop: 25,
//           }}
//         >
//           VALUED AUDIENCES PLEASE TAKE INTO CONSIDERATION WHEN BUYING MOVIE
//           TICKETS (ESPECIALLY FOR ONLINE TICKETS). THE NATIONAL CINEMA CENTER
//           DOES NOT ACCEPT REFUNDS OR EXCHANGES OF SUCCESSFULLY PAID TICKETS
//           (ONLINE TICKETS AND INCORRECTLY PURCHASED TICKETS AT THE COUNTER)
//         </p>
//         <p
//           style={{
//             display: "block",
//             marginTop: 33,
//           }}
//         >
//           Thank you for your valued cooperation.
//           <br />
//           Best Regards!
//         </p>
//         <hr
//           style={{
//             border: "none",
//             borderTop: "2px dashed #888",
//             margin: "50px 0",
//             width: "26%",
//           }}
//         />
//         <p>
//           - Mua vé xem phim tập thể, hợp đồng khoán gọn:
//           <br />
//           <b
//             style={{
//               display: "block",
//               marginTop: 5,
//               fontStyle: "italic",
//             }}
//           >
//             Phòng Chiếu phim - (024) 35148647
//           </b>
//         </p>
//         <p
//           style={{
//             display: "block",
//             marginTop: 30,
//           }}
//         >
//           - Thuê phòng tổ chức Hội nghị, làm văn phòng, quảng cáo và các dịch vụ
//           khác:
//           <br />
//           <b
//             style={{
//               display: "block",
//               marginTop: 5,
//             }}
//           >
//             Phòng Dịch vụ - (024) 35142856
//           </b>
//         </p>
//         <p>
//           <b>.TTCPQG</b>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default TicketPricePage;
