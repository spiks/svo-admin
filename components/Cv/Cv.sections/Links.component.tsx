import React, { FC, useContext } from 'react';
import { CvSection } from '@components/Cv/Cv.children/CvSection.component';
import { CvSubTitle } from '@components/Cv/Cv.children/CvSubTitle.component';
import styles from '../Cv.module.css';
import { CvContext } from '@components/Cv/Cv.component';

export const Links: FC = () => {
  const query = useContext(CvContext);
  const socialLinks = query.data?.socialLinks;
  const presentation = query.data?.presentation;

  return (
    <CvSection title={'Ссылки'}>
      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '8px' }}>
        {presentation && (
          <>
            <CvSubTitle>Видеовизитка</CvSubTitle>
            <a className={styles['link']} href={'/'}>
              {presentation.url}
            </a>
            <div style={{ height: '8px' }} />
          </>
        )}
        {socialLinks?.vkLink && (
          <>
            <CvSubTitle>ВКонтакте</CvSubTitle>
            <a className={styles['link']} href={'/'}>
              {socialLinks.vkLink}
            </a>
            <div style={{ height: '8px' }} />
          </>
        )}
        {socialLinks?.facebookLink && (
          <>
            <CvSubTitle>Facebook</CvSubTitle>
            <a className={styles['link']} href={'/'}>
              {socialLinks.facebookLink}
            </a>
            <div style={{ height: '8px' }} />
          </>
        )}
        {socialLinks?.telegramLink && (
          <>
            <CvSubTitle>Telegram</CvSubTitle>
            <a className={styles['link']} href={'/'}>
              {socialLinks.telegramLink}
            </a>
            <div style={{ height: '8px' }} />
          </>
        )}
        {socialLinks?.instagramLink && (
          <>
            <CvSubTitle>Telegram</CvSubTitle>
            <a className={styles['link']} href={'/'}>
              {socialLinks.instagramLink}
            </a>
            <div style={{ height: '8px' }} />
          </>
        )}
        {socialLinks?.twitterLink && (
          <>
            <CvSubTitle>Telegram</CvSubTitle>
            <a className={styles['link']} href={'/'}>
              {socialLinks.twitterLink}
            </a>
            <div style={{ height: '8px' }} />
          </>
        )}
        {socialLinks?.youtubeLink && (
          <>
            <CvSubTitle>Telegram</CvSubTitle>
            <a className={styles['link']} href={'/'}>
              {socialLinks.youtubeLink}
            </a>
            <div style={{ height: '8px' }} />
          </>
        )}
      </div>
    </CvSection>
  );
};
