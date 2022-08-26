import { Report } from "../models";
import { User } from "../models";
import { sendgrid } from "../libs/sendgrid";
export async function createReport(userId, petid, reportInfo) {
    const newReport = await Report.create({ ...reportInfo, pet_id: petid });
    const userOwnerPet = await User.findByPk(userId);
    const emailUser = userOwnerPet["email"];
    const fechaDeReporte = new Date().toDateString();
    //mensaje para el dueño de la mascota perdida
    const msg = {
        to: emailUser,
        from: "daniwortiz003@gmail.com",
        subject: "¡Nueva información sobre tu mascota!",
        html: textHTML(
            reportInfo["reporter"],
            reportInfo.description,
            fechaDeReporte,
            reportInfo["phone_number"],
            userOwnerPet["full_name"]
        ),
    };
    await sendgrid(msg);
    return newReport;
}

function textHTML(userReporter, info, fecha, phoneNumber, userOwner) {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title></title>
    <!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]-->
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
    <!--[if gte mso 9]>
<xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG></o:AllowPNG>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
</xml>
<![endif]-->
    <!--[if !mso]><!-- -->
    <link href="https://fonts.googleapis.com/css2?family=Kanit&display=swap" rel="stylesheet">
    <!--<![endif]-->
</head>

<body>
    <div class="es-wrapper-color">
        <!--[if gte mso 9]>
			<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
				<v:fill type="tile" color="#f6f6f6"></v:fill>
			</v:background>
		<![endif]-->
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td class="esd-email-paddings" valign="top">
                        <table class="esd-header-popover es-header" cellspacing="0" cellpadding="0" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center">
                                        <table class="es-header-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p10b es-p20r es-p20l" align="left">
                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-container-frame es-m-p20b" width="560" align="left">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center">
                                        <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" align="center">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p25b es-p15r es-p10l" style="background-color: #010101;" bgcolor="#010101" align="left">
                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="es-m-p0r esd-container-frame" width="575" valign="top" align="center">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-block-text es-p10t es-p10b" align="center">
                                                                                        <p style="font-size: 14px; color: #e1fbf5;">${fecha}</p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="esd-block-text es-m-txt-c es-p10t es-p10b es-p40r es-p40l es-m-p0r es-m-p0l" align="center">
                                                                                        <h1 style="line-height: 120%;">Información sobre tu mascota!</h1>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="esd-block-text es-m-txt-c es-p5t es-p5b es-p40r es-p40l es-m-p0r es-m-p0l" align="center">
                                                                                        <h3 style="line-height: 120%; color: #f9f9f8; padding:10px;"><u>Hola <span style="color:yellow;">${userOwner}</span>, ¿Cómo te encuentras?.<br> Hace un momento <span style="color:green;">${userReporter}</span> nos ha dicho donde podría encontrarse tu mascota perdida.</u><br></h3>
                                                                                        <h3 style="line-height: 120%; color: #f9f9f8;margin-top:10px"><u>Su número de télefono: ${phoneNumber}</u><br></h3>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="esd-block-text es-p10t es-p30b es-p40r es-p40l es-m-p0r es-m-p0l" align="center">
                                                                                        <p style="line-height: 150%; color: #fafbfb; padding:10px">${info}</p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="esd-block-image" style="font-size: 0px;" align="center"><p><img class="adapt-img" src="https://demo.stripocdn.email/content/guids/e3da399c-9798-42c4-9f92-adc33384c5c7/images/thesecretlifeofpetsanimalscartoonipadair.jpg" alt="Greenpeace day" style="display: block; margin-bottom:50px" title="Greenpeace day" width="575"></p></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center">
                                        <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#A8D87E" align="center">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure" align="left">
                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-container-frame" width="600" valign="top" align="center">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-empty-container" align="center" style="display: none;"></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="esd-footer-popover es-footer" cellspacing="0" cellpadding="0" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center">
                                        <table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p20b es-p20r es-p20l" esd-custom-block-id="590935" align="left">
                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-container-frame" width="560" align="left">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-block-menu" esd-tmp-menu-padding="10|10" esd-tmp-menu-color="#402218" esd-tmp-menu-font-size="12px" esd-tmp-menu-font-weight="normal" esd-tmp-divider="1|solid|#999999">
                                                                                        <table class="es-menu" width="100%" cellspacing="0" cellpadding="0">
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="esd-block-social es-p10t es-p10b" style="font-size:0" align="center">
                                                                                        <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0">
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p20b es-p20r es-p20l" align="left">
                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="es-m-p20b esd-container-frame" width="560" align="left">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <div style="width:100%; hight:30px;background-color:#000"></div>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>
    `;
}
