import { FC, useContext, useMemo } from 'react';
import { Avatar } from 'antd';
import { CvName } from '@components/Cv/Cv.children/CvName.component';
import { CvText } from '@components/Cv/Cv.children/CvText.component';
import { CvSubTitle } from '@components/Cv/Cv.children/CvSubTitle.component';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { CvContext } from '@components/Cv/Cv.component';

export const Top: FC = () => {
  const { data } = useContext(CvContext);

  const personalInformation = data!.personalInformation;
  const servicePricing = data!.servicePricing;
  const passport = data!.documents.passport;

  const minPrice = useMemo(() => {
    if (servicePricing.forIndividualSession && servicePricing.forPairSession) {
      return Math.min(servicePricing?.forPairSession, servicePricing?.forIndividualSession);
    }

    return servicePricing.forIndividualSession || servicePricing.forPairSession;
  }, [servicePricing.forIndividualSession, servicePricing.forPairSession]);

  const avatarSrc = personalInformation.avatar?.sizes.medium.url
    ? `https://${personalInformation.avatar?.sizes.medium.url}`
    : undefined;

  const patronymic = passport?.information?.patronymic || '';

  return (
    <section
      style={{
        display: 'flex',
        marginBottom: '24px',
        paddingBottom: '24px',
        justifyContent: 'space-between',
        borderBottom: '1px solid #E8E8F4',
      }}
    >
      <div
        style={{
          display: 'flex',
          columnGap: '14px',
        }}
      >
        <div>
          <Avatar src={avatarSrc} size={73} />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <CvName>
            {[passport?.information.surname, passport?.information.name, patronymic].filter(Boolean).join(' ')}
          </CvName>
          <CvText>Стоимость услуг: {!minPrice ? '-' : `от ${minPrice} руб.`}</CvText>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: '8px',
          marginTop: '6px',
        }}
      >
        <CvSubTitle>Контакт:</CvSubTitle>
        <CvSubTitle>
          <MailOutlined /> {personalInformation.email || '-'}
        </CvSubTitle>
        <CvSubTitle>
          <PhoneOutlined /> {personalInformation.phone || '-'}
        </CvSubTitle>
      </div>
    </section>
  );
};
