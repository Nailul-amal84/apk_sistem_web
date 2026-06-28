<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.5;
        }
        .header-info {
            width: 100%;
            margin-bottom: 20px;
        }
        .header-info td {
            vertical-align: top;
            padding: 1px 0;
        }
        .tanggal-surat {
            text-align: right;
        }
        .tujuan-block {
            margin: 20px 0;
        }
        .tujuan-nama {
            font-weight: bold;
        }
        .tujuan-tempat {
            margin-left: 20px;
        }
        .salam-pembuka {
            font-style: italic;
            margin: 20px 0 10px 0;
        }
        .paragraf {
            text-align: justify;
            text-indent: 40px;
            margin: 10px 0;
        }
        .penutup-block {
            margin-top: 30px;
            text-align: center;
        }
        .ttd-container {
            width: 100%;
            margin-top: 10px;
            text-align: center;
        }
        .ttd-box {
            display: inline-block;
            width: 220px;
            text-align: center;
            vertical-align: top;
            padding: 0 10px;
        }
        .ttd-space {
            height: 80px;
        }
        .ttd-nama {
            font-weight: bold;
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <table class="header-info">
        <tr>
            <td width="60">Nomor</td>
            <td width="15">:</td>
            <td>{{ $surat->nomor_surat }}</td>
            <td class="tanggal-surat">{{ $surat->kota }}, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</td>
        </tr>
        <tr>
            <td>Lamp</td>
            <td>:</td>
            <td>{{ $surat->lampiran ?? '-' }}</td>
            <td></td>
        </tr>
        <tr>
            <td>Hal</td>
            <td>:</td>
            <td><strong>{{ $surat->perihal }}</strong></td>
            <td></td>
        </tr>
    </table>

    <div class="tujuan-block">
        Kepada Yth.<br>
        <span class="tujuan-nama">{{ $surat->tujuan }}</span><br>
        di-<br>
        <span class="tujuan-tempat"><u>Tempat</u></span>
    </div>

    <div class="salam-pembuka">
        Assalamu'alaikum Wr. Wb
    </div>

    <div class="paragraf">
        Segala puji bagi Allah SWT atas segala karunia yang telah diberikan kepada kita. Shalawat beserta salam selalu kita hadiahkan kepada Nabi Besar Muhammad SAW yang telah mengantarkan kita dari alam kebodohan ke alam yang penuh dengan ilmu pengetahuan.
    </div>

    <div class="paragraf">
        {!! nl2br(e($surat->isi_surat)) !!}
    </div>

    <div class="paragraf" style="text-indent: 0;">
        Demikianlah surat ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.
    </div>

    <div class="salam-pembuka" style="margin-top: 10px;">
        Wassalamu'alaikum Wr. Wb
    </div>

    <div class="penutup-block">
        Hormat kami,<br>
        @if($surat->atas_nama)
            {{ $surat->atas_nama }}
        @endif
    </div>

    <div class="ttd-container">
        @foreach($surat->tandaTangan as $ttd)
        <div class="ttd-box">
            {{ $ttd->jabatan }}
            <div class="ttd-space"></div>
            <span class="ttd-nama">({{ $ttd->nama }})</span>
        </div>
        @endforeach
    </div>

</body>
</html>