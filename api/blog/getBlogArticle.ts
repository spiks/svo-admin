import { AdminBlogServiceWithToken } from 'api/services';
import { Uuid } from 'generated';
import { mediaImageMock } from '../mocks';

export const getBlogArticle = async (id: Uuid) => {
  try {
    return AdminBlogServiceWithToken.getBlogArticle({ requestBody: { arguments: { id } } });
  } catch (error) {
    return {
      status: 'success',
      data: {
        id: 'd274b02e-646c-4624-b623-8a75e75d4293',
        slug: 'nogotochki-15',
        title: 'Персональные данные — почему они всем так нужны (кроме нас)',
        cover: mediaImageMock,
        tags: [
          {
            id: 'd274b02e-646c-4624-b623-8a75e75d4293',
            name: 'общая практика',
          },
        ],
        shortText: 'Персональные данные — почему они всем так нужны (кроме нас)',
        showPreviewFromArticle: true,
        text: '[Lorem markdownum sisto](http://qui.net/precibusque-quisque) meque quae ignis\nPelagonaque occupat cruori, nisi. Luna me sidera [verum illa\nobiecit](http://amplexibusnostras.net/contingentlycum) tectus, manusque\nrecanduit murmur! Et gelidos missi nec non nec, **siccis** me et, de alebat,\ncorpus herbis; [unus](http://coniugis-non.net/leto-gloria), et?\n\n> Amicus ripae: curasque ignes; per solvit, verus sidera cecidit petiit,\n> vallibus. Finemque solita: raptaque de novem manibus, venae nunc discedere\n> Polymestora *Hector dixit inmurmurat* discedens. Illa pondus superos cinxisse\n> puerpera rerumque iusto procul, sic canamus fabricator *multos*. Tibia\n> validisne iunctis iuvenalia eodem cerebro tamen.\n\n## Cancri Saturnia se lacrimis ignaro quidem pondere\n\nSero secus lacrimas ab Eurytus parvae referitur Priamidas et rigido smaragdis\npignora. Vim de harenis, suorum utque Troiae exhortor balteus dotem. Ubi det\npraestanti egentes hiatu virtute tu times certamine tollit, ab suis probant\nmunera habent. Nolle altera, est sinunt eadem cavas utiliter ac cava deus\nstricto viscera: nulla. Sim in ebur calathis globos hominum frondes, victrix,\nquis.\n\n    if (exif(nntpIntellectual + bar)) {\n        null_hard_remote.modemSocket.halftone_restore(-3, barDisplayUnit,\n                peripheralLockMultiprocessing);\n        requirements.jspCcHover.peripheral(4, appletMaskRetina);\n        fiosComponentResponsive = gbps;\n    }\n    if (page_radcab_printer <= 2 + 3) {\n        namespace = shareware_direct;\n    }\n    softwareLinkedinThroughput.language = 2 - udp_cybercrime;\n\n## Iam Rex Aethalion\n\nDiversaeque oculos regia [canet visa](http://adspexit.org/) gratia retia [campis\nin](http://sit-illi.net/ereptus-excipiunt.html) illis. Cadentem Gyaroque virgo\n*nihil Scythiae* ostendit virgo. Quos cupit nepotibus trium. Vultu patet\nresolutis ad cui age vi crimine: Cerberus dies, silvis en signa sit.\n\n1. Procrin ocius formas Elymumque\n2. Sedulitas tingui eiectatamque ingeminat tempore et arbor\n3. An pabula animalia iactas patriaeque posset solidas\n4. Inplacabile undis ista addidit\n\nDum lucis pharetram concresse aliquis per unus cuius et oblivia frigidus\nviventi. Et pro conpellat, et patriae Ceres sensi illi mitia.',
        author: {
          fullName: 'Степан Арвеладзе',
          avatar: mediaImageMock,
        },
        publicationDate: '1996-04-17T22:55:33+00:00',
        status: 'article_rejected',
        isArchived: true,
        showInBlockInterestingAndUseful: true,
      },
    };
  }
};
