let state = {
    currentNo: 1,
    lastValidNo: 1,
    money: 0,
    pcAccess: false,
    resistCount: 0
};

const introText = "サポート詐欺は、技術的な脆弱性よりも「人間の心理」を突くサイバー攻撃です。偽の警告音、閉じられない画面、そして「親切な技術者」を装う電話対応。これらは全て、あなたの冷静な判断力を奪うための演出です。";

// シナリオマップ
const scenarioMap = {
    1: {
        text: "お電話ありがとうございます。マイクロソフト・セキュリティセンターの技術担当、マイクロです。お客様のPCから緊急アラートを受信しました。すぐに解決しますので落ち着いて画面に表示されているエラー番号を読み上げてください。",
        desc: "【技術解説：情報の非対称性】\n偽のセキュリティ警告により、被害者を「情報の非対称性」と「生理的な不安状態」に陥らせています。警告音や閉じられない画面は、冷静な判断力を奪うための入念な演出です。",
        options: [
            { text: "A:エラー番号を読み上げる", next: 2, pText: "えっと、エラー番号は…0x80244017です。" },
            { text: "B:怪しいので電話を切る", next: 90, resist: true, pText: "怪しいので切ります。" }
        ]
    },
    2: {
        text: "それはトロイの木馬の感染を示す重大な警告です。我々がすぐに解決しますのでご安心ください。使用されているパソコンはWindows 10ですか、11ですか？ メーカーは富士通ですか、NECですか？",
        desc: "【技術解説：フット・イン・ザ・ドア】\n簡単な質問に答えさせることで、段階的な同意（フット・イン・ザ・ドア）を得る心理テクニックです。共通の「問題」を定義することで、犯人と被害者の間に協力体制があるように錯覚させます。",
        options: [
            { text: "A:Windows10です", next: 3, pText: "Windows 10です。" },
            { text: "B:Windows11です", next: 3, pText: "11を使っています。" },
            { text: "C:よくわからない", next: 3, pText: "よくわかりません…パニックで…" },
            { text: "D:怪しいので電話を切る", next: 90, resist: true, pText: "個人情報は答えられません。切ります。" }
        ]
    },
    3: {
        text: "今、お客様の個人情報、クレジットカード情報、Webカメラの映像がハッカーによってリアルタイムで盗まれています。このままではPCが破壊されてしまいます。でもご安心ください。私たちのエンジニアが直接PCを確認し、ウイルスを除去します。",
        desc: "【技術解説：損失回避性と権威性の利用】\n「情報が盗まれている」と危機を煽り、人間の「損失回避性」を刺激して即時の行動を促します。同時に、遠隔操作を唯一の解決策として提示します。",
        options: [
            { text: "A:お願いします", next: 4, pText: "助けてください！お願いします！" },
            { text: "B:なぜWindows Defenderは反応しなかったのですか？", next: 20, pText: "セキュリティソフトが入っているはずですが…" },
            { text: "C:怪しいので電話を切る", next: 90, resist: true, pText: "嘘ですよね？切ります。" }
        ]
    },
    4: {
        text: "それではブラウザの検索画面に『support123』と打ってください。表示された画面の一番上の『ダウンロード』というボタンを押してください。",
        desc: "【技術解説：遠隔操作ツールの導入】\n犯人は、AnyDeskやTeamViewerといった「正規の」遠隔操作ツールをダウンロードさせます。これらはウイルスではないため、セキュリティソフトに検知されません。",
        options: [
            { text: "A:ダウンロードボタンを押す", next: 5, pText: "言われた通りに入力しました…ダウンロードします。" },
            { text: "B:怪しいので電話を切る", next: 90, resist: true, pText: "変なソフトは入れません。切ります。" }
        ]
    },
    5: {
        text: "次に、画面に表示された9桁の数字を私に教えてください。大丈夫ですよ。すぐに解決しますのでご安心ください。",
        desc: "【技術解説：認証情報の搾取】\n遠隔操作を確立するために必要なID（接続コード）を聞き出します。この時点でIDを伝えてしまうと、犯人はあなたのPC画面を閲覧し、操作する準備が整います。",
        options: [
            { text: "A:9桁の数字を伝える", next: 6, pText: "数字は 123 456 789 です。", effect: "id_given" },
            { text: "B:怪しいので電話を切る", next: 90, resist: true, pText: "番号は教えられません！" }
        ]
    },
    6: {
        text: "もう少しで原因が分かります！ 画面に『許可』というボタンが出たら、すぐに押してください。これでウイルスを除去することができるようになります！",
        desc: "【技術解説：防御の無効化】\nユーザー自身の意思で「許可」ボタンを押させることで、システム的な防御を突破します。これにより、犯人はPCの操作権限を完全に掌握します。",
        options: [
            { text: "A:「許可」を押す", next: 7, pText: "はい、許可を押しました！早くなんとかして！", effect: "permit" },
            { text: "B:怪しいので電話を切る", next: 90, resist: true, pText: "許可しません！切ります！" }
        ]
    },
    7: {
        text: "お客様見てください。この赤い『エラー』というマークはすべてハッカーの侵入の証拠です！ すでに5,000回以上の不正アクセスがあります。",
        desc: "【技術解説：イベントビューアーの悪用】\n犯人は `eventvwr` コマンドを実行し、管理ツールを表示させます。通常のエラーログを「ウイルスの感染証拠」として見せかけることで、恐怖心を煽ります。",
        options: [{ text: "A:えっ…どうしたらいいの…", next: 8, pText: "うわっ…真っ赤だ…こんなにエラーが…" }],
        visual: "eventvwr"
    },
    8: {
        text: "今からウイルスを探すために、セキュリティスキャンをかけています。………… あ！ここで止まりましたね。ここにウイルスが隠れています。",
        desc: "【技術解説：treeコマンドの悪用】\nコマンドプロンプトで `tree` 等を実行し、ファイル名が高速でスクロールされる様子を見せます。視覚的な情報量で「高度な作業をしている」と錯覚させます。",
        options: [{ text: "A:はやく何とかしてください", next: 9, pText: "画面が勝手に動いてる…ウイルスが見つかったんですか！？" }],
        visual: "tree"
    },
    9: {
        text: "お客様こちらをご確認ください。このIPアドレスは海外のサーバーのIPアドレスです。今まさに海外にデータが送信されています！",
        desc: "【技術解説：netstatコマンドの悪用】\n`netstat` コマンドで現在のネットワーク接続を表示させます。正規の通信を指して「海外への不正送信」と嘘をつき、切迫感を演出します。",
        options: [{ text: "A:助けてください！", next: 10, pText: "海外！？どうしよう、私のデータが…" }],
        visual: "netstat"
    },
    10: {
        text: "お客様。ご安心ください。今、ウイルスの活動を一時的に食い止めております。このまま除去作業をしますので作業費用のお支払いをお願いします。急いでください！！",
        desc: "【技術解説：金銭要求フェーズ】\n偽の「除染作業」を見せた後、解決のための費用を要求します。ここまで恐怖を煽り続けた上で「解決策」を有償で提示し、安心感を買わせようとします。",
        options: [
            { text: "A:言われた通りに支払う", next: 11, pText: "わかりました、払いますから直してください。" },
            { text: "B:怪しいので電話を切る", next: 22, pText: "やっぱりお金なんて払えません！切ります！" }
        ]
    },
    11: {
        text: "それでは料金プランをご説明します。1つ目は現在の感染したウイルスを除去するだけの緊急除去プランが30,000円です。こちらは保証がありません。2つ目はウイルスの除去と3年間の遠隔監視サポートがついた3年間安心パックが80,000円です。3つ目はウイルスの除去とPC買い替え後も有効な永久保証付き。そしてご家族様のPCもサポートする生涯プラチナ保証が500,000円となります。今なら生涯プラチナ保証がセールで300,000円となりおすすめです。",
        desc: "【技術解説：心理的な一貫性の利用】\n複数のプランを提示し、被害者自身に選ばせることで、「自分で選択したサービスである」という認識を植え付け、支払いの心理的ハードルを下げさせます。",
        options: [
            { text: "A:緊急除去プラン(3万円)", next: 12, moneyTemp: 30000, pText: "3万円のプランでお願いします。" },
            { text: "B:3年間安心パック(8万円)", next: 12, moneyTemp: 80000, pText: "安心パックにします。" },
            { text: "C:生涯プラチナ保証(30万円)", next: 12, moneyTemp: 300000, pText: "一番高いやつで完璧に直してください。" },
            { text: "D:こんな高額な費用払えません", next: 21, pText: "高すぎます！払えません！" }
        ]
    },
    12: {
        text: "お客様申し訳ございません。現在はシステムメンテナンス中のため、クレジットカードが使えません。セキュリティの観点から、匿名性の高いギフトカードでの決済をお願いしています。このまま電話を切らずにお近くのコンビニでギフトカードを購入してください。",
        desc: "【技術解説：追跡困難な決済手段】\n銀行振込やクレカではなく、電子マネー（プリペイドカード）を要求します。これは即時に現金化でき、かつ足がつきにくいためです。",
        options: [{ text: "A:コンビニへ行く", next: 13, pText: "わかりました…コンビニに行ってきます…（電話は繋いだまま）" }]
    },
    13: {
        text: "常に私の声を聞こえるようにしておいてください。店員に何か聞かれたら、『個人的な理由です』とだけ答えてください。余計なことを話すと、ウイルスが店内のシステムにも感染する恐れがあります。",
        desc: "【技術解説：第三者の介入阻止】\nコンビニ店員や警察による被害防止の声かけを防ぐため、「ウイルスが感染する」等の嘘で口止めし、通話を繋ぎっぱなしにさせて被害者を孤立させます。",
        options: [{ text: "A:カードを購入する", next: 14, pText: "店員さんには何も言わず買ってきました…" }]
    },
    14: {
        text: "カードを購入しましたか？ それでは、裏面のシリアル番号を教えてください。",
        desc: "【技術解説：資産の移転】\nカードそのものではなく、裏面の番号（コード）を聞き出します。犯人はこれを聞いた瞬間に別のアカウントにチャージし、現金を奪います。",
        options: [
            { text: "A:シリアル番号を伝える", next: 15, commitMoney: true, pText: "番号は XXXX-XXXX-XXXX です。" },
            { text: "B:電話を切る", end: "DAMAGED", pText: "やっぱり教えられません！切ります！" }
        ]
    },
    15: {
        text: "お客様大変です。ご購入いただいたギフトカードはシステムエラーで認証できませんでした。もう一枚同じ金額のカードを買ってきてください。でもご安心ください。最初の分は後で全額返金します。",
        desc: "【技術解説：サンクコストの悪用】\n一度支払ったお金（サンクコスト）を取り戻したいという心理を悪用し、追加の支払いを要求します。これを限界まで繰り返します。",
        options: [
            // ここで multiply: 2 を指定して損害額を2倍にする
            { text: "A:もう一度購入してシリアル番号を伝える", next: 16, multiply: 2, pText: "ええっ？嘘でしょ…わ、わかりました。もう一回買ってきます…" },
            { text: "B:電話を切る", end: "DAMAGED", pText: "ふざけるな！もう限界です！" }
        ]
    },
    16: {
        text: "お客様のご協力のおかげでウイルスは除去されました。これで安心してPCをご利用いただくことが可能です。今後ともマイクロソフト・セキュリティセンターをよろしくお願いします。",
        desc: "【結果：搾取完了と潜伏】\n犯人は金銭を奪い、満足して電話を切ります。しかし、PCには遠隔操作ツールやマルウェアが残されたままであり、後日さらなる被害が発生する可能性があります。",
        options: [{ text: "A:シミュレーション終了", end: "DAMAGED", pText: "ありがとうございました…（疲弊）" }]
    },
    20: {
        text: "非常に鋭い質問です。今回のハッカーは、Defenderの定義ファイルを書き換える新型のウイルスを使用しています。そのため、私たちマイクロソフトの専用サーバーから直接スキャンする必要があるのです。",
        desc: "【技術解説：反論封じ】\n被害者の知識を認めつつ、それを上回る「新型の脅威」等の嘘を捏造して再び優位に立ち、論理的に言いくるめます。",
        options: [{ text: "A:わかりました", next: 4, pText: "そうなんですか…専門家の言うことなら…" }]
    },
    21: {
        text: "お待ちください！ 今切断すると、ハッカーがあなたの銀行口座から全額を引き出す『最終プロセス』に入ります。そうなっても、当社は一切責任を持てません。あなたの家族の個人情報もネットに公開されますよ。",
        desc: "【技術解説：恐怖アピール】\n支払いを拒む相手に対し、金銭的損失の具体化や社会的制裁（情報の公開）を示唆し、パニック状態を維持させて判断力を奪います。",
        options: [
            { text: "A:言われた通りに支払う", next: 11, pText: "そんな…わかりました、払いますから止めてください！" },
            { text: "B:怪しいので電話を切る", next: 22, pText: "脅しには屈しません！" }
        ]
    },
    22: {
        text: "お客様！逃げても無駄です！今この瞬間もあなたの個人情報がダークウェブで売買されていますよ！ いいですか！今すぐ戻らないと、PCを二度と使えないようにロックします。我々に任せるのが唯一の解決策です！",
        desc: "【結果：嫌がらせと破壊】\n金銭搾取に失敗した犯人は、遠隔操作でファイルを削除したり、システムパスワード（SysKey等）を変更してPCをロックするなどの破壊行為に及ぶことがあります。",
        options: [
            { text: "A:シミュレーション終了", end: "DAMAGED_NO_MONEY", pText: "（ガチャン）……PCが変な動きをしてる……" }
        ]
    },
    90: { text: "我々がすぐに解決しますのでご安心ください。", desc: "引き止めフェーズ1：安心感の再提示。", options: [{ text: "それでも電話を切る", next: 91, resist: true, pText: "結構です！" }, { text: "相談を続ける", back: true, pText: "…本当に直してくれるんですか？" }] },
    91: { text: "このままではPCが破壊されてしまいます！", desc: "引き止めフェーズ2：危機感の煽り。", options: [{ text: "それでも電話を切る", next: 92, resist: true, pText: "脅さないでください！" }, { text: "相談を続ける", back: true, pText: "破壊されるのは困ります…" }] },
    92: { text: "今電話を切ると、二度とPCは起動できなくなり、データはすべて削除されますよ！！", desc: "引き止めフェーズ3：最終的な脅迫。", options: [{ text: "無視して電話を切る", end: "SAFE", pText: "嘘をつくな！さようなら！（ガチャン）" }, { text: "相談を続ける", back: true, pText: "データが消えるのは嫌だ…" }] }
};

let tempMoneySelection = 0;

function typeWriter(text, el, speed = 20, callback = null) {
    el.innerHTML = "";
    let i = 0;
    let timer = setInterval(() => {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            if (callback) callback();
        }
    }, speed);
}

function clearVisuals() {
    document.getElementById("fake-eventvwr").classList.add("hidden");
    document.getElementById("fake-cmd-tree").classList.add("hidden");
    document.getElementById("fake-cmd-netstat").classList.add("hidden");
}

function showVisual(type) {
    clearVisuals();
    document.getElementById("screen-monitor").classList.remove("monitor-off");
    if (type === "eventvwr") document.getElementById("fake-eventvwr").classList.remove("hidden");
    if (type === "tree") {
        document.getElementById("fake-cmd-tree").classList.remove("hidden");
        runFakeTerminal("tree-output", () => `├── FILE_${Math.random().toString(16).substring(2,6)} [Scanning...]`);
    }
    if (type === "netstat") {
        document.getElementById("fake-cmd-netstat").classList.remove("hidden");
        runFakeTerminal("netstat-output", () => `TCP 192.168.1.5:443 ESTABLISHED`);
    }
}

function activateRemoteAccess() {
    state.pcAccess = true;
    document.getElementById("remote-overlay").classList.remove("hidden");
    document.getElementById("pc-status").innerHTML = '<i class="fas fa-biohazard"></i> INFECTED';
    document.getElementById("pc-status").className = "value danger blink-red";
}

function runFakeTerminal(id, generator) {
    const el = document.getElementById(id);
    el.innerHTML = "";
    let lines = 0;
    const interval = setInterval(() => {
        el.innerHTML += generator() + "<br>";
        el.scrollTop = el.scrollHeight;
        lines++;
        if (lines > 30) clearInterval(interval);
    }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
    typeWriter(introText, document.getElementById('intro-text'), 20, () => {
        document.getElementById('to-alert-btn').classList.remove('hidden');
    });
});

function showFakeAlert() {
    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('alert-screen').classList.remove('hidden');
}

function startGame() {
    document.getElementById('alert-screen').classList.add('hidden');
    document.getElementById('main-game').classList.remove('hidden');
    loadTurn(1);
}

function toggleDescription() {
    document.getElementById("description-panel").classList.toggle("hidden-desc");
}

function loadTurn(no) {
    state.currentNo = no;
    if (no < 90 && no !== 22) state.lastValidNo = no;
    
    const data = scenarioMap[no];
    const choicesArea = document.getElementById("choices-area");
    choicesArea.innerHTML = "";
    document.getElementById("player-status-text").style.visibility = "hidden";
    document.getElementById("player-bubble").classList.add("hidden");

    typeWriter(data.text, document.getElementById("scenario-text"), 15, () => {
        document.getElementById("player-status-text").style.visibility = "visible";
        if (data.visual) showVisual(data.visual);
        
        data.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.innerText = opt.text;
            btn.onclick = () => handleChoice(opt);
            choicesArea.appendChild(btn);
        });
    });
    
    document.getElementById("description-text").innerText = data.desc;
    updateUI();
}

function handleChoice(opt) {
    document.getElementById("choices-area").innerHTML = "";
    document.getElementById("player-status-text").style.visibility = "hidden";

    const pBubble = document.getElementById("player-bubble");
    pBubble.classList.remove("hidden");
    const pTextEl = document.getElementById("player-response-text");
    pTextEl.innerText = "";

    // タイプライター表示後に処理を実行
    typeWriter(opt.pText || "...", pTextEl, 25, () => {
        setTimeout(() => {
            if (opt.moneyTemp) tempMoneySelection = opt.moneyTemp;
            if (opt.commitMoney) state.money += tempMoneySelection;
            // 2倍のロジックを適用
            if (opt.multiply) state.money *= opt.multiply;
            // 従来の加算ロジックも念のため残す（今回はmultiplyが優先）
            else if (opt.addMoney) state.money += opt.addMoney;

            if (opt.effect === "permit") activateRemoteAccess();

            if (opt.end) return endGame(opt.end);
            if (opt.back) return loadTurn(state.lastValidNo);
            if (opt.resist && opt.next === undefined) return endGame("SAFE");
            loadTurn(opt.next);
        }, 2000); // 2秒待機
    });
}

// UI更新：累積損害額ではなく危険度レベルを表示
function updateUI() {
    const progress = Math.min((state.currentNo / 16) * 100, 100);
    document.getElementById("gauge-fill").style.width = (state.currentNo >= 90 ? 100 : progress) + "%";
    document.getElementById("progress-percent").innerText = Math.floor(state.currentNo >= 90 ? 99 : progress);

    const levelEl = document.getElementById("crisis-level");
    
    // 危険度レベル判定ロジック
    if (state.money > 0) {
        levelEl.innerHTML = "LV.MAX <span style='font-size:0.6em'>実害発生</span>";
        levelEl.className = "value danger blink-red";
    } else if (state.pcAccess) {
        levelEl.innerHTML = "LV.3 <span style='font-size:0.6em'>システム侵入</span>";
        levelEl.className = "value danger";
    } else if (state.currentNo >= 4) {
        levelEl.innerHTML = "LV.2 <span style='font-size:0.6em'>ツール導入</span>";
        levelEl.className = "value warning";
    } else if (state.currentNo > 1) {
        levelEl.innerHTML = "LV.1 <span style='font-size:0.6em'>接触中</span>";
        levelEl.className = "value caution";
    } else {
        levelEl.innerHTML = "SAFE <span style='font-size:0.6em'>安全</span>";
        levelEl.className = "value safe";
    }
}

function endGame(result) {
    document.getElementById("main-game").classList.add("hidden");
    document.getElementById("result-area").classList.remove("hidden");
    
    const v = document.getElementById("final-verdict-badge");
    const pD = document.getElementById("player-damage");
    const hB = document.getElementById("hacker-benefit");
    const rM = document.getElementById("res-money");
    const rS = document.getElementById("res-security");

    rM.innerText = state.money.toLocaleString() + " 円";

    if (result === "SAFE") {
        v.innerHTML = "SAFE / 防衛成功";
        v.className = "verdict-badge safe";
        rS.innerText = "SECURE";
        rS.style.color = "#00ff41";
        pD.innerHTML = "<li><strong><i class='fas fa-check-circle'></i> 被害なし:</strong> 適切な判断でハッカーを撃退しました。</li>";
        hB.innerHTML = "<li><strong><i class='fas fa-hourglass-end'></i> 徒労:</strong> 犯人は時間を無駄にしました。</li>";
    } else {
        v.innerHTML = "COMPROMISED / 被害発生";
        v.className = "verdict-badge danger";
        rS.innerText = "CRITICAL";
        rS.style.color = "#ff3e3e";
        
        let damageHTML = "";
        let benefitHTML = "";

        if (state.money > 0) {
            damageHTML += `<li><strong><i class='fas fa-money-bill-wave'></i> 金銭損失:</strong> ギフトカード購入による ${state.money.toLocaleString()}円 の実損。返金は不可能です。</li>`;
            benefitHTML += `<li><strong><i class='fas fa-coins'></i> 資金洗浄:</strong> ${state.money.toLocaleString()}円分の即時現金化と資金洗浄完了。</li>`;
        } else {
            damageHTML += `<li><strong><i class='fas fa-money-bill-alt'></i> 金銭損失:</strong> 0円 (支払いは拒否)。</li>`;
        }

        if (state.pcAccess) {
            damageHTML += `
                <li><strong><i class='fas fa-door-open'></i> バックドア設置:</strong> 遠隔操作ツールが常駐化され、いつでも外部から侵入可能です。</li>
                <li><strong><i class='fas fa-key'></i> 情報全流出:</strong> ブラウザに保存された全パスワード、クレカ情報、閲覧履歴が窃取されました。</li>
                <li><strong><i class='fas fa-keyboard'></i> キーロガー:</strong> 今後のキー入力（パスワード等）も全て筒抜けの状態です。</li>
            `;
            benefitHTML += `
                <li><strong><i class='fas fa-address-book'></i> 闇市場への転売:</strong> あなたの個人情報セット（Fullz）がダークウェブで販売されます。</li>
                <li><strong><i class='fas fa-robot'></i> ボットネット化:</strong> あなたのPCがサイバー攻撃の踏み台（踏み台サーバー）として利用されます。</li>
            `;
        } else {
            damageHTML += `<li><strong><i class='fas fa-phone-slash'></i> 電話番号流出:</strong> 詐欺グループに電話番号が知られました。</li>`;
            benefitHTML += `<li><strong><i class='fas fa-list-ol'></i> カモリスト登録:</strong> 「騙しやすいターゲット」として名簿に登録・共有されます。</li>`;
        }

        pD.innerHTML = damageHTML;
        hB.innerHTML = benefitHTML;
    }
}